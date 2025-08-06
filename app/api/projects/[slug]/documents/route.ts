import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { logDocumentCreated } from "@/lib/activity-logger";

const documentSchema = z.object({
  title: z.string().min(1, "Document title is required"),
  content: z.string().min(1, "Document content is required"),
  isPublished: z.boolean().default(false),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    
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

    const documents = await prisma.document.findMany({
      where: {
        projectId: project.id
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Get documents error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const { slug } = await params;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { title, content, isPublished } = documentSchema.parse(body);

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

    // Generate slug from title
    const documentSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    // Check if slug already exists in this project
    const existingDocument = await prisma.document.findFirst({
      where: {
        slug: documentSlug,
        projectId: project.id
      }
    });

    if (existingDocument) {
      return NextResponse.json(
        { error: "Document with this title already exists in this project" },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        title,
        content,
        slug: documentSlug,
        isPublished,
        projectId: project.id,
        userId: session.user.id,
      }
    });

    // Log activity
    await logDocumentCreated(session.user.id, project.id, document.id, document.title);

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create document error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 