import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        projects: {
          include: {
            documents: true,
          }
        },
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      projects: user.projects.map(project => ({
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
        createdAt: project.createdAt,
        documents: project.documents.map(doc => ({
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          content: doc.content,
          createdAt: doc.createdAt,
        })),
      })),
      exportDate: new Date().toISOString(),
    };

    return NextResponse.json(exportData, {
      headers: {
        "Content-Disposition": `attachment; filename="user-data-${user.id}.json"`
      }
    });
  } catch (error) {
    console.error("Export data error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 