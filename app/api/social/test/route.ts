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
    // Test if we can access the SocialPost model
    const postCount = await prisma.socialPost.count();
    
    return NextResponse.json({ 
      success: true,
      message: 'Social media API is working!',
      postCount,
      user: session.user.email
    });
  } catch (error) {
    console.error('Social test error:', error);
    return NextResponse.json({ 
      error: 'Social media API test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 