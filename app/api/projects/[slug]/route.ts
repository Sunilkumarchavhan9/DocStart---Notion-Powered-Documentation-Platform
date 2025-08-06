import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { authOptions } from "@/lib/auth";

const updateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").optional(),
  description: z.string().optional(),
  isPublic: z.boolean().optional(),
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

    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } },
          { isPublic: true }
        ]
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { documents: true, members: true }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const updateData = updateProjectSchema.parse(body);

    // Check if user owns the project
    const existingProject = await prisma.project.findFirst({
      where: {
        slug: slug,
        userId: session.user.id
      }
    });

    if (!existingProject) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Generate new slug if name is being updated
    let newSlug = existingProject.slug;
    if (updateData.name && updateData.name !== existingProject.name) {
      newSlug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      
      // Check if new slug already exists
      const slugExists = await prisma.project.findFirst({
        where: {
          slug: newSlug,
          id: { not: existingProject.id }
        }
      });

      if (slugExists) {
        return NextResponse.json(
          { error: "Project with this name already exists" },
          { status: 400 }
        );
      }
    }

    const updatedProject = await prisma.project.update({
      where: { id: existingProject.id },
      data: {
        ...updateData,
        slug: newSlug,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: { name: true, email: true }
        },
        _count: {
          select: { documents: true, members: true }
        }
      }
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Update project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Check if user owns the project
    const project = await prisma.project.findFirst({
      where: {
        slug: slug,
        userId: session.user.id
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Delete project and all related data
    await prisma.project.delete({
      where: { id: project.id }
    });

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 