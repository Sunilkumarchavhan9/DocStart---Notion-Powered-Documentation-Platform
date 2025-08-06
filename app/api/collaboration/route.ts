import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Store active collaborators in memory (in production, use Redis)
const activeCollaborators = new Map<string, Set<string>>();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get active collaborators for this document
    const collaborators = activeCollaborators.get(documentId) || new Set();
    const collaboratorDetails = [];

    for (const userId of collaborators) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true }
      });
      
      if (user) {
        collaboratorDetails.push({
          id: user.id,
          name: user.name || user.email,
          color: getRandomColor(user.id)
        });
      }
    }

    return NextResponse.json({ collaborators: collaboratorDetails });
  } catch (error) {
    console.error("Get collaborators error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId, action, content, cursorPosition } = body;

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Add user to active collaborators
    if (!activeCollaborators.has(documentId)) {
      activeCollaborators.set(documentId, new Set());
    }
    activeCollaborators.get(documentId)!.add(session.user.id);

    // Update document content if provided
    if (content !== undefined) {
      await prisma.document.update({
        where: { id: documentId },
        data: { content }
      });
    }

    // Log collaboration activity
    await prisma.activity.create({
      data: {
        type: "DOCUMENT_UPDATED",
        userId: session.user.id,
        documentId: documentId,
        metadata: {
          action,
          cursorPosition,
          timestamp: new Date().toISOString()
        }
      }
    });

    return NextResponse.json({ 
      success: true,
      message: "Collaboration update recorded"
    });
  } catch (error) {
    console.error("Collaboration update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("documentId");

    if (!documentId) {
      return NextResponse.json(
        { error: "Document ID is required" },
        { status: 400 }
      );
    }

    // Remove user from active collaborators
    const collaborators = activeCollaborators.get(documentId);
    if (collaborators) {
      collaborators.delete(session.user.id);
      if (collaborators.size === 0) {
        activeCollaborators.delete(documentId);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "User removed from collaboration"
    });
  } catch (error) {
    console.error("Remove collaborator error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to generate consistent colors for users
function getRandomColor(userId: string): string {
  const colors = [
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57",
    "#ff9ff3", "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43"
  ];
  
  // Use userId to generate consistent color
  const hash = userId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  return colors[Math.abs(hash) % colors.length];
} 