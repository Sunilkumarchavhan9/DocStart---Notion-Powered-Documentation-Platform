import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotionClient } from '@/lib/notion-client';

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
      },
    });

    if (!user?.notionAccessToken) {
      return NextResponse.json({ error: 'Notion not connected' }, { status: 400 });
    }

    const notionClient = await createNotionClient(user.notionAccessToken);
    const pages = await notionClient.getPages();

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching Notion pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { title, documentSlug } = await request.json();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { notionAccessToken: true },
    });

    if (!user?.notionAccessToken) {
      return NextResponse.json({ error: 'Notion not connected' }, { status: 400 });
    }

    const notionClient = await createNotionClient(user.notionAccessToken);
    
    // Create page with DocStart metadata in title
    const pageTitle = `${title} [DocStart:${documentSlug}]`;
    const page = await notionClient.createPage(pageTitle);

    if (!page) {
      return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
    }

    // Find the document first, then update it
    const document = await prisma.document.findFirst({
      where: { 
        slug: documentSlug,
        project: {
          userId: session.user.id,
        },
      },
    });

    if (document) {
      // Update the document with Notion page ID
      await prisma.document.update({
        where: { id: document.id },
        data: { 
          notionPageId: page.id,
          notionPageUrl: page.url,
        },
      });
    }

    return NextResponse.json({ page });
  } catch (error) {
    console.error('Error creating Notion page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}