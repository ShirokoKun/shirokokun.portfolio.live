import Parser from 'rss-parser';
import { NextResponse } from 'next/server';
import type { SubstackPost } from '@/types/substack';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Note: This API route won't work with static export (output: 'export')
// The component now fetches directly from Substack RSS feed
// This route is kept for future use if static export is removed

const parser = new Parser();

export async function GET() {
  try {
    // Fetch fresh feed on every request
    const feed = await parser.parseURL('https://shirokokun.substack.com/feed');

    const posts: SubstackPost[] = (feed.items || []).map((item: any) => ({
      title: item.title || '',
      link: item.link || '',
      pubDate: item.pubDate || '',
      author: item.creator || item.author || '',
      content: item.content || '',
      contentSnippet: item.contentSnippet || '',
      guid: item.guid || '',
      isoDate: item.isoDate || '',
      categories: item.categories || [],
      enclosure: item.enclosure,
    }));

    return NextResponse.json(
      { posts },
      {
        headers: {
          // Reduced cache time to 5 minutes for faster updates
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          // Add timestamp to help with cache busting
          'X-Content-Timestamp': new Date().toISOString(),
        },
      }
    );
  } catch (error) {
    console.error('Error fetching Substack feed:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
}
