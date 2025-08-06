import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get document version history
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

    // Get document versions
    const versions = await prisma.documentVersion.findMany({
      where: {
        document: {
          slug: documentSlug,
          projectId: project.id
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    });

    return NextResponse.json(versions);
  } catch (error) {
    console.error("Get document versions error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create new version (auto-save)
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
    const { content, title } = await request.json();

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

    // Create new version
    const version = await prisma.documentVersion.create({
      data: {
        title,
        content,
        versionNumber: document.versionCount + 1,
        documentId: document.id,
        userId: session.user.id
      }
    });

    // Update document version count
    await prisma.document.update({
      where: { id: document.id },
      data: { versionCount: { increment: 1 } }
    });

    return NextResponse.json(version);
  } catch (error) {
    console.error("Create document version error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 