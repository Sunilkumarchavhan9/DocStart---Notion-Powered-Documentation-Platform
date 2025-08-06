import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'success',
    message: 'Social media API is working!',
    timestamp: new Date().toISOString(),
    endpoints: {
      automate: '/api/social/automate',
      test: '/api/social/test',
      debug: '/api/social/debug'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({ 
      status: 'success',
      message: 'Social media POST is working!',
      receivedData: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to parse request body',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
} 