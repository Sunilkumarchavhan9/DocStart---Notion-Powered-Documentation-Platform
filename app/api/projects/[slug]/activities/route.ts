import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

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

    // Get recent activities for the project
    const activities = await prisma.activity.findMany({
      where: {
        projectId: project.id
      },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Get activities error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 