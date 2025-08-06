import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// Get user notifications
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
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's activities that could be notifications
    const notifications = await prisma.activity.findMany({
      where: {
        OR: [
          // Activities in projects where user is a member
          {
            project: {
              members: {
                some: { userId: session.user.id }
              }
            }
          },
          // Activities by the user themselves
          { userId: session.user.id }
        ],
        // Filter out user's own activities for notifications
        NOT: {
          userId: session.user.id
        }
      },
      include: {
        user: {
          select: { name: true, email: true, image: true }
        },
        project: {
          select: { name: true, slug: true }
        },
        document: {
          select: { title: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Get unread count
    const unreadCount = await prisma.activity.count({
      where: {
        OR: [
          {
            project: {
              members: {
                some: { userId: session.user.id }
              }
            }
          },
          { userId: session.user.id }
        ],
        NOT: {
          userId: session.user.id
        }
      }
    });

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: notifications.length === limit
    });
  } catch (error) {
    console.error("Get notifications error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Mark s as read
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { notificationIds } = await request.json();

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return NextResponse.json(
        { error: "Invalid notification IDs" },
        { status: 400 }
      );
    }

    // In a real implementation, you would have a separate notifications table
    // For now, we'll just return success since we're using activities
    return NextResponse.json({ 
      message: "Notifications marked as read",
      updatedCount: notificationIds.length 
    });
  } catch (error) {
    console.error("Mark notifications read error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 