import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const NOTION_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/notion/callback';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!session?.user) {
    return NextResponse.redirect('/auth/signin?error=unauthorized');
  }

  if (!code) {
    return NextResponse.redirect('/dashboard?error=notion_auth_failed');
  }

  // Verify state matches user ID for security
  if (state !== session.user.id) {
    return NextResponse.redirect('/dashboard?error=invalid_state');
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.notion.com/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${NOTION_CLIENT_ID}:${NOTION_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: NOTION_REDIRECT_URI,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error('Notion OAuth error:', tokenData);
      return NextResponse.redirect('/dashboard?error=notion_token_failed');
    }

    // Store the Notion access token in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        notionAccessToken: tokenData.access_token,
        notionWorkspaceId: tokenData.workspace_id,
        notionBotId: tokenData.bot_id,
      },
    });

    return NextResponse.redirect('/dashboard?notion_connected=true');
  } catch (error) {
    console.error('Notion OAuth callback error:', error);
    return NextResponse.redirect('/dashboard?error=notion_callback_failed');
  }
}