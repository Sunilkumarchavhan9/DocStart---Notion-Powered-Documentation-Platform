import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Notion OAuth configuration
const NOTION_CLIENT_ID = process.env.NOTION_CLIENT_ID;
const NOTION_CLIENT_SECRET = process.env.NOTION_CLIENT_SECRET;
const NOTION_REDIRECT_URI = process.env.NEXTAUTH_URL + '/api/auth/notion/callback';

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Build Notion OAuth URL
  const notionAuthUrl = new URL('https://api.notion.com/v1/oauth/authorize');
  notionAuthUrl.searchParams.set('client_id', NOTION_CLIENT_ID!);
  notionAuthUrl.searchParams.set('response_type', 'code');
  notionAuthUrl.searchParams.set('owner', 'user');
  notionAuthUrl.searchParams.set('redirect_uri', NOTION_REDIRECT_URI);
  notionAuthUrl.searchParams.set('state', session.user.id); // Use user ID as state for security

  return NextResponse.redirect(notionAuthUrl.toString());
}