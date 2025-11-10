import { NextResponse } from 'next/server';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function GET() {
  try {
    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      return NextResponse.json(
        { error: 'YouTube credentials not configured' },
        { status: 500 }
      );
    }

    // Step 1: Get uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${YOUTUBE_CHANNEL_ID}&key=${YOUTUBE_API_KEY}`,
      { method: 'GET' }
    );

    if (!channelResponse.ok) {
      throw new Error('Failed to fetch channel info');
    }

    const channelData = await channelResponse.json();
    const uploadsPlaylistId = channelData.items[0]?.contentDetails?.relatedPlaylists?.uploads;

    if (!uploadsPlaylistId) {
      throw new Error('Could not find uploads playlist');
    }

    // Step 2: Get videos from uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=6&key=${YOUTUBE_API_KEY}`,
      { method: 'GET' }
    );

    if (!playlistResponse.ok) {
      throw new Error('Failed to fetch playlist items');
    }

    const playlistData = await playlistResponse.json();

    // Step 3: Get video statistics
    const videoIds = playlistData.items
      .map((item: any) => item.snippet.resourceId.videoId)
      .join(',');

    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`,
      { method: 'GET' }
    );

    if (!statsResponse.ok) {
      throw new Error('Failed to fetch video statistics');
    }

    const statsData = await statsResponse.json();

    // Step 4: Combine data
    const videos = playlistData.items.map((item: any, index: number) => {
      const stats = statsData.items[index]?.statistics || {};
      const videoId = item.snippet.resourceId.videoId;

      return {
        id: videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        viewCount: stats.viewCount || '0',
        likeCount: stats.likeCount || '0',
        videoUrl: `https://www.youtube.com/watch?v=${videoId}`,
      };
    });

    return NextResponse.json(
      { success: true, videos, count: videos.length },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    console.error('Error fetching YouTube videos:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch YouTube videos', videos: [] },
      { status: 500 }
    );
  }
}
