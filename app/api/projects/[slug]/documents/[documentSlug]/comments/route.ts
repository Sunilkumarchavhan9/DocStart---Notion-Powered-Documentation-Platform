import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const commentSchema = z.object({
  content: z.string().min(1).max(1000),
  lineNumber: z.number().optional(),
  parentId: z.string().optional(),
});

// Get comments for a document
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug, documentSlug } = await params;

    // Get project and verify access
    const project = await prisma.project.findFirst({
      where: { 
        slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get document
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

    // Get comments with replies
    const comments = await prisma.comment.findMany({
      where: {
        documentId: document.id,
        parentId: null // Only top-level comments
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        replies: {
          include: {
            user: {
              select: { name: true, email: true, image: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Get comments error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new comment
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string; documentSlug: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { slug, documentSlug } = await params;
    const body = await request.json();
    const { content, lineNumber, parentId } = commentSchema.parse(body);

    // Get project and verify access
    const project = await prisma.project.findFirst({
      where: { 
        slug,
        OR: [
          { userId: session.user.id },
          { members: { some: { userId: session.user.id } } }
        ]
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found" },
        { status: 404 }
      );
    }

    // Get document
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

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content,
        lineNumber,
        documentId: document.id,
        userId: session.user.id,
        parentId
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        }
      }
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        type: "COMMENT_ADDED",
        userId: session.user.id,
        projectId: project.id,
        documentId: document.id,
        metadata: {
          commentId: comment.id,
          lineNumber
        }
      }
    });

    return NextResponse.json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Create comment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 