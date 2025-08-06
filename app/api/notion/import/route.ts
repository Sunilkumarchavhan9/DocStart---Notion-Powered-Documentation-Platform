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
    const { pageId, pageTitle, documentSlug, projectId } = await request.json();

    // Get user's Notion access token
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notionAccessToken: true },
    });

    if (!user?.notionAccessToken) {
      return NextResponse.json({ error: 'Notion not connected' }, { status: 400 });
    }

    // Get the document to update
    const document = await prisma.document.findFirst({
      where: { 
        slug: documentSlug,
        project: {
          userId: session.user.id,
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Create Notion client and get page content
    const notionClient = await createNotionClient(user.notionAccessToken);
    const blocks = await notionClient.getPageContent(pageId);
    
    if (!blocks) {
      return NextResponse.json({ error: 'Failed to fetch Notion content' }, { status: 500 });
    }

    // Convert blocks to HTML
    const htmlContent = await notionClient.convertBlocksToHtml(blocks);

    // Update the document with imported content and Notion page info
    const updatedDocument = await prisma.document.update({
      where: { id: document.id },
      data: {
        title: pageTitle,
        content: htmlContent,
        notionPageId: pageId,
        notionPageUrl: `https://notion.so/${pageId.replace(/-/g, '')}`,
        lastSyncedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true,
      document: updatedDocument,
      message: 'Successfully imported from Notion'
    });
  } catch (error) {
    console.error('Error importing from Notion:', error);
    return NextResponse.json({ error: 'Failed to import from Notion' }, { status: 500 });
  }
} 