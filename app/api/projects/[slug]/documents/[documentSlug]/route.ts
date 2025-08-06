import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { logDocumentUpdated, logDocumentPublished } from "@/lib/activity-logger";

const updateDocumentSchema = z.object({
  title: z.string().min(1, "Document title is required").optional(),
  content: z.string().min(1, "Document content is required").optional(),
  isPublished: z.boolean().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug, documentSlug } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get project and check access
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } },
          { isPublic: true }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const document = await prisma.document.findFirst({
      where: {
        slug: documentSlug,
        projectId: project.id
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error("Get document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug, documentSlug } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData = updateDocumentSchema.parse(body);

    // Get project and check access
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const existingDocument = await prisma.document.findFirst({
      where: {
        slug: documentSlug,
        projectId: project.id
      }
    });

    if (!existingDocument) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Generate new slug if title is being updated
    let newDocumentSlug = existingDocument.slug;
    if (updateData.title && updateData.title !== existingDocument.title) {
      newDocumentSlug = updateData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      // Check if new slug already exists in this project
      const slugExists = await prisma.document.findFirst({
        where: {
          slug: newDocumentSlug,
          projectId: project.id,
          id: { not: existingDocument.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Document with this title already exists in this project" },
          { status: 400 }
        );
      }
    }

    const updatedDocument = await prisma.document.update({
      where: { id: existingDocument.id },
      data: {
        ...updateData,
        slug: newDocumentSlug,
        updatedAt: new Date()
      }
    });

    // Log activity
    await logDocumentUpdated(session.user.id, project.id, updatedDocument.id, updatedDocument.title);
    
    // Log publishing activity if status changed
    if (updateData.isPublished !== undefined && updateData.isPublished !== existingDocument.isPublished) {
      await logDocumentPublished(session.user.id, project.id, updatedDocument.id, updatedDocument.title);
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug, documentSlug } = await params;
    
    console.log('PATCH request received:', { slug, documentSlug, userId: session?.user?.id });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const updateData = updateDocumentSchema.parse(body);

    // Get project and check access
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      console.log('Project not found in PATCH:', { slug, userId: session.user.id });
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const existingDocument = await prisma.document.findFirst({
      where: {
        slug: documentSlug,
        projectId: project.id
      }
    });

    if (!existingDocument) {
      console.log('Document not found in PATCH:', { documentSlug, projectId: project.id });
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // If publishing a document, also make the project public
    const updateDataWithProject = { ...updateData };
    if (updateData.isPublished === true) {
      // Make the project public when publishing a document
      await prisma.project.update({
        where: { id: project.id },
        data: { isPublic: true }
      });
    }

    const updatedDocument = await prisma.document.update({
      where: { id: existingDocument.id },
      data: {
        ...updateDataWithProject,
        updatedAt: new Date()
      }
    });

    // Log activity
    await logDocumentUpdated(session.user.id, project.id, updatedDocument.id, updatedDocument.title);
    
    // Log publishing activity if status changed
    if (updateData.isPublished !== undefined && updateData.isPublished !== existingDocument.isPublished) {
      await logDocumentPublished(session.user.id, project.id, updatedDocument.id, updatedDocument.title);
    }

    return NextResponse.json(updatedDocument);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug, documentSlug } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get project and check access
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    const document = await prisma.document.findFirst({
      where: {
        slug: documentSlug,
        projectId: project.id
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    // Delete document
    await prisma.document.delete({
      where: { id: document.id }
    });

    return NextResponse.json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 