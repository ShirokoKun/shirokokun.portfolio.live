import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const parser = new Parser({
  customFields: {
    item: [
      ['media:content', 'media'],
      ['content:encoded', 'contentEncoded'],
    ],
  },
});

const SUBSTACK_RSS_URL = 'https://shirokokun.substack.com/feed';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

let postsCache: any = null;
let lastFetchTime = 0;

export async function GET() {
  try {
    // Check cache
    const now = Date.now();
    if (postsCache && (now - lastFetchTime) < CACHE_DURATION) {
      console.log('📦 Returning cached posts');
      return NextResponse.json({ posts: postsCache });
    }

    console.log('🔍 Fetching fresh posts from Substack RSS...');
    
    const feed = await parser.parseURL(SUBSTACK_RSS_URL);
    
    const posts = feed.items.map((item: any) => ({
      title: item.title || '',
      slug: item.link?.split('/').pop() || '',
      excerpt: item.contentSnippet?.substring(0, 200) || '',
      content: item.content || item.contentEncoded || '',
      publishedAt: item.pubDate || item.isoDate || new Date().toISOString(),
      link: item.link || '',
      thumbnail: item.enclosure?.url || item.media?.$ || null,
      tags: item.categories || [],
      author: item.creator || item.author || '',
      guid: item.guid || item.link,
      contentSnippet: item.contentSnippet || '',
      enclosure: item.enclosure ? {
        url: item.enclosure.url,
        type: item.enclosure.type,
      } : null,
    }));

    console.log(`✅ Fetched ${posts.length} posts from Substack`);
    
    // Update cache
    postsCache = posts;
    lastFetchTime = now;

    return NextResponse.json({ posts });
  } catch (error) {
    console.error('❌ Error fetching Substack RSS:', error);
    
    // Return cached posts if available, even if expired
    if (postsCache) {
      console.log('⚠️ Returning stale cached posts due to error');
      return NextResponse.json({ posts: postsCache });
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', posts: [] },
      { status: 500 }
    );
  }
}
