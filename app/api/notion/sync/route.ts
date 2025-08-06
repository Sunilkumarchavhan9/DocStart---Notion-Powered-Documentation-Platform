import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotionClient } from '@/lib/notion-client';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { documentSlug } = await request.json();

    // Get the document with Notion page ID
    const document = await prisma.document.findFirst({
      where: { 
        slug: documentSlug,
        project: {
          userId: session.user.id,
        },
      },
      select: {
        id: true,
        notionPageId: true,
        notionPageUrl: true,
        lastSyncedAt: true,
      },
    });

    if (!document?.notionPageId) {
      return NextResponse.json({ error: 'Document not connected to Notion' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { 
        notionAccessToken: true,
        notionWorkspaceId: true,
        notionBotId: true,
      },
    });

    if (!user?.notionAccessToken) {
      return NextResponse.json({ error: 'Notion not connected' }, { status: 400 });
    }

    const notionClient = await createNotionClient(user.notionAccessToken);
    
    // Get content from Notion
    const blocks = await notionClient.getPageContent(document.notionPageId);
    if (!blocks) {
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    // Convert blocks to HTML
    const htmlContent = await notionClient.convertBlocksToHtml(blocks);

    // Update the document with synced content
    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: { 
        content: htmlContent,
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      document: updatedDocument,
      syncedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error syncing from Notion:', error);
    return NextResponse.json({ error: 'Failed to sync content' }, { status: 500 });
  }
}

// GET endpoint to check sync status
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const documentSlug = searchParams.get('documentSlug');
  
  if (!session?.user || !documentSlug) {
    return NextResponse.json({ error: 'Unauthorized or missing params' }, { status: 401 });
  }

  try {
    const document = await prisma.document.findFirst({
      where: { 
        slug: documentSlug,
        project: {
          userId: session.user.id,
        },
      },
      select: {
        notionPageId: true,
        notionPageUrl: true,
        lastSyncedAt: true,
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    return NextResponse.json({
      isConnected: !!document.notionPageId,
      notionPageUrl: document.notionPageUrl,
      lastSyncedAt: document.lastSyncedAt,
    });
  } catch (error) {
    console.error('Error checking sync status:', error);
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 });
  }
}