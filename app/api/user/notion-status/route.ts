import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        notionAccessToken: true,
        notionWorkspaceId: true,
        notionBotId: true,
      },
    });

    const isConnected = !!(user?.notionAccessToken && user?.notionWorkspaceId);

    return NextResponse.json({ 
      isConnected,
      workspaceId: user?.notionWorkspaceId || null,
    });
  } catch (error) {
    console.error('Error checking Notion status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}