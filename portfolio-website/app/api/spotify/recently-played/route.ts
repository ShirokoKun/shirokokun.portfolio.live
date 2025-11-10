import { NextResponse } from 'next/server';

// Force dynamic rendering - no static generation or caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=1';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: SPOTIFY_REFRESH_TOKEN || '',
    }),
  });

  return response.json();
};

const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();

  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

export async function GET() {
  try {
    // Validate environment variables
    if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) {
      console.error('Missing Spotify credentials');
      return NextResponse.json(
        { error: 'Spotify credentials not configured' },
        { status: 500 }
      );
    }

    const response = await getRecentlyPlayed();

    if (response.status === 204 || response.status > 400) {
      console.log('Spotify API returned no content or error:', response.status);
      return NextResponse.json({ error: 'No recently played tracks' }, { status: 200 });
    }

    const data = await response.json();

    if (!data.items || data.items.length === 0) {
      console.log('No recently played tracks found');
      return NextResponse.json({ error: 'No recently played tracks' }, { status: 200 });
    }

    const track = data.items[0].track;
    const playedAt = data.items[0].played_at;

    console.log(`🕒 Last played: "${track.name}" by ${track.artists.map((a: any) => a.name).join(', ')} at ${playedAt}`);

    return NextResponse.json(
      {
        title: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        albumImageUrl: track.album.images[0]?.url,
        songUrl: track.external_urls.spotify,
        duration: track.duration_ms,
        playedAt,
        timestamp: Date.now(),
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'CDN-Cache-Control': 'no-store',
          'Vercel-CDN-Cache-Control': 'no-store',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching recently played:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recently played' },
      { status: 500 }
    );
  }
}
