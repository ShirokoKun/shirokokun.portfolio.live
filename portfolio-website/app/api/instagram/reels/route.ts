import { NextResponse } from 'next/server';

// Instagram Basic Display API
const INSTAGRAM_ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_USER_ID = process.env.INSTAGRAM_USER_ID;

export async function GET() {
  try {
    if (!INSTAGRAM_ACCESS_TOKEN || !INSTAGRAM_USER_ID) {
      return NextResponse.json(
        { error: 'Instagram credentials not configured' },
        { status: 500 }
      );
    }

    // Fetch user's media (photos and videos including Reels)
    const response = await fetch(
      `https://graph.instagram.com/${INSTAGRAM_USER_ID}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${INSTAGRAM_ACCESS_TOKEN}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Instagram media');
    }

    const data = await response.json();

    // Filter for VIDEO type (Reels are videos)
    const reels = data.data
      .filter((item: any) => item.media_type === 'VIDEO')
      .slice(0, 6) // Get latest 6 reels
      .map((reel: any) => ({
        id: reel.id,
        caption: reel.caption || '',
        mediaUrl: reel.media_url,
        thumbnailUrl: reel.thumbnail_url || reel.media_url,
        permalink: reel.permalink,
        timestamp: reel.timestamp,
      }));

    return NextResponse.json(
      { reels },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Instagram reels:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram reels', reels: [] },
      { status: 500 }
    );
  }
}
