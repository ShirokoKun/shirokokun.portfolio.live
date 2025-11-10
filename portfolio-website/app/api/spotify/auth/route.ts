import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// This endpoint helps you get the authorization URL
export async function GET() {
  if (!SPOTIFY_CLIENT_ID) {
    return NextResponse.json(
      { error: 'Spotify Client ID not configured' },
      { status: 500 }
    );
  }

  const scopes = [
    'user-read-currently-playing',
    'user-read-recently-played',
    'user-read-playback-state',
  ];

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: SPOTIFY_CLIENT_ID,
    scope: scopes.join(' '),
    redirect_uri: 'http://localhost:3000/api/spotify/callback',
  });

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;

  return NextResponse.json({
    authUrl,
    instructions: [
      '1. Visit the authUrl below',
      '2. Log in and authorize the app',
      '3. You will be redirected to /api/spotify/callback',
      '4. Copy the refresh_token from the response',
      '5. Add it to your .env.local file as SPOTIFY_REFRESH_TOKEN',
    ],
  });
}
