import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { 
      documentSlug, 
      platforms, 
      message, 
      scheduledTime,
      autoGenerate 
    } = await request.json();

    // Get the document - first try to find it by slug across all accessible projects

    // Get the document - first try to find it by slug across all accessible projects
    let document = await prisma.document.findFirst({
      where: { 
        slug: documentSlug,
        project: {
          OR: [
            { userId: session.user.id },
            { members: { some: { userId: session.user.id } } },
            { isPublic: true }
          ]
        },
      },
    });

    // If not found, try a broader search across all projects
    if (!document) {
      const broaderDocument = await prisma.document.findFirst({
        where: { 
          slug: documentSlug,
        },
        include: {
          project: {
            select: {
              id: true,
              slug: true,
              name: true,
              userId: true,
              isPublic: true
            }
          }
        }
      });
      
      if (broaderDocument) {
        document = broaderDocument;
      }
    }



    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    // Check if document is published
    if (!document.isPublished) {
      return NextResponse.json({ 
        error: 'Document must be published before creating social media posts',
        documentId: document.id,
        isPublished: document.isPublished
      }, { status: 400 });
    }

    // Generate social media content if requested
    let socialContent = message;
    if (autoGenerate && document) {
      socialContent = generateSocialContent(document.title, document.content);
    }

    // Create social media posts
    const posts = await Promise.all(
      platforms.map(async (platform: string) => {
        // Generate platform-specific content
        const platformContent = autoGenerate && document
          ? generateSocialContent(document.title, document.content, platform)
          : socialContent;
          
        const post = await prisma.socialPost.create({
          data: {
            documentId: document!.id,
            platform,
            content: platformContent,
            scheduledTime: scheduledTime ? new Date(scheduledTime) : null,
            status: scheduledTime ? 'scheduled' : 'draft',
            userId: session.user.id,
          },
        });
        return post;
      })
    );

    // If immediate posting is requested, trigger the posts
    if (!scheduledTime) {
      await Promise.all(
        posts.map(async (post) => {
          await triggerSocialPost(post);
        })
      );
    }

    return NextResponse.json({ 
      success: true,
      posts,
      message: scheduledTime ? 'Posts scheduled successfully' : 'Posts published successfully'
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create social posts' }, { status: 500 });
  }
}

function generateSocialContent(title: string, content: string, platform?: string): string {
  // Extract key points from content
  const textContent = content.replace(/<[^>]*>/g, '').substring(0, 200);
  
  // Generate different content for different platforms
  const templates = {
    twitter: `New: ${title}\n\n${textContent}...\n\nRead more: [LINK]`,
    linkedin: `Just published: ${title}\n\n${textContent}...\n\n#documentation #tech #productivity`,
    facebook: `Check out our latest: ${title}\n\n${textContent}...\n\nWhat do you think?`,
    instagram: `New content alert!\n\n${title}\n\n${textContent}...\n\nSwipe up to read more!`
  };

  if (platform && templates[platform as keyof typeof templates]) {
    return templates[platform as keyof typeof templates];
  }
  
  return templates.twitter; // Default to Twitter format
}

async function triggerSocialPost(post: any) {
  try {
    // This would integrate with actual social media APIs
    // For now, we'll just update the status
    await prisma.socialPost.update({
      where: { id: post.id },
      data: { 
        status: 'published',
        publishedAt: new Date()
      },
    });

    // In a real implementation, you would:
    // 1. Use Twitter API for Twitter posts
    // 2. Use LinkedIn API for LinkedIn posts
    // 3. Use Facebook API for Facebook posts
    // 4. Handle Instagram posts (usually manual)
    
    // Published successfully
  } catch (error) {
    // Failed to publish
    
    await prisma.socialPost.update({
      where: { id: post.id },
      data: { 
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
    });
  }
}

// GET endpoint to fetch social posts for a document
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
          OR: [
            { userId: session.user.id },
            { members: { some: { userId: session.user.id } } },
            { isPublic: true }
          ]
        },
      },
    });

    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }

    const posts = await prisma.socialPost.findMany({
      where: { documentId: document.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 