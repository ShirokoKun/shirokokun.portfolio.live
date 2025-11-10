'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { RefreshCw, AlertCircle } from 'lucide-react';
import type { SubstackPost } from '@/types/substack';
import PostSkeleton from './ui/PostSkeleton';

const CACHE_KEY = 'substack_posts_cache';
const CACHE_TIMESTAMP_KEY = 'substack_posts_timestamp';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Load cached posts from localStorage
const loadCachedPosts = (): SubstackPost[] | null => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY);
    if (cached && timestamp) {
      const age = Date.now() - parseInt(timestamp, 10);
      if (age < CACHE_DURATION) {
        return JSON.parse(cached);
      }
    }
  } catch (e) {
    console.error('Error loading cache:', e);
  }
  return null;
};

// Save posts to localStorage
const saveCachedPosts = (posts: SubstackPost[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(posts));
    localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString());
  } catch (e) {
    console.error('Error saving cache:', e);
  }
};

// Fetch posts from backend API
const fetchPostsFromAPI = async (): Promise<SubstackPost[]> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s timeout
  
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  console.log('🔍 Fetching from backend:', backendUrl);
  
  try {
    const response = await fetch(`${backendUrl}/api/blog/posts`, {
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    console.log('📦 Data received:', data);
    console.log('📝 Posts count:', data.posts?.length || 0);
    
    if (data.posts && Array.isArray(data.posts) && data.posts.length > 0) {
      return data.posts;
    }
    throw new Error('No posts found in response');
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('❌ Fetch error:', err);
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw err;
  }
};

export default function SubstackBlog() {
  const [posts, setPosts] = useState<SubstackPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [mounted, setMounted] = useState(false);
  const postsRef = useRef<SubstackPost[]>([]);
  
  // Keep ref in sync with state
  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  // Set mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchPosts = useCallback(async (showRefreshing = false, forceRefresh = false) => {
    const currentPosts = postsRef.current.length;
    if (showRefreshing) setRefreshing(true);
    
    // Load cached posts first (unless forcing refresh) - show immediately for instant UX
    if (!forceRefresh) {
      const cached = loadCachedPosts();
      if (cached && cached.length > 0) {
        setPosts(cached);
        setLoading(false);
        // Continue fetching fresh posts in background
      }
    }
    
    try {
      setIsRetrying(false);
      
      // Use server-side API route (much faster than CORS proxies)
      const fetchedPosts = await fetchPostsFromAPI();
      
      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        saveCachedPosts(fetchedPosts);
        setError(null);
      } else {
        throw new Error('No posts found');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Network error';
      setError(errorMessage);
      console.error('Error fetching Substack feed:', err);
      
      // If we have no posts, try to load from cache
      if (currentPosts === 0) {
        const cached = loadCachedPosts();
        if (cached && cached.length > 0) {
          setPosts(cached);
          setError('Using cached posts. ' + errorMessage);
        } else {
          // Auto-retry after 5 seconds if no posts are shown
          setIsRetrying(true);
          setTimeout(() => {
            fetchPosts(false, true);
          }, 5000);
        }
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setIsRetrying(false);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Load cached posts immediately
    const cached = loadCachedPosts();
    if (cached && cached.length > 0) {
      setPosts(cached);
      setLoading(false);
    }
    
    // Then fetch fresh posts
    fetchPosts();
  }, [mounted, fetchPosts]);

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-bold text-white">Latest Thoughts</h1>
            <button
              onClick={() => fetchPosts(true, true)}
              disabled={refreshing}
              className="glass-surface p-2 rounded-lg hover:scale-110 transition-transform disabled:opacity-50"
              aria-label="Refresh posts"
            >
              <RefreshCw 
                size={20} 
                className={`text-white ${refreshing ? 'animate-spin' : ''}`} 
              />
            </button>
          </div>
          <p className="text-gray-400 mt-2">From Substack — auto-updating via RSS</p>
          
          {/* Error banner - non-blocking */}
          {error && (
            <div className="mt-4 glass-surface border border-yellow-500/30 bg-yellow-500/10 rounded-lg p-3 flex items-center justify-center gap-2 text-yellow-400 text-sm">
              <AlertCircle size={16} />
              <span>{error}</span>
              {isRetrying && <span className="text-xs">(Retrying...)</span>}
            </div>
          )}
        </div>

        {(!mounted || (loading && posts.length === 0)) ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PostSkeleton />
            <PostSkeleton />
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 glass-card p-8">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-white mb-2">Coming Soon!</h3>
              <p className="text-gray-400 mb-4">
                New thoughts and stories are on their way. 
                Check back soon or subscribe to my Substack to get notified!
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => fetchPosts(true, true)}
                  className="glass-surface px-4 py-2 rounded-lg text-white hover:scale-105 transition-transform"
                >
                  Refresh
                </button>
                <a
                  href="https://shirokokun.substack.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-surface px-4 py-2 rounded-lg text-white hover:scale-105 transition-transform"
                >
                  Visit Substack →
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post, index) => {
              const delayClass = index < 6 ? `post-fade-in-${index}` : 'post-fade-in-5';
              return (
              <article
                key={post.guid}
                className={`glass-card p-6 hover:translate-y-[-2px] transition-all duration-500 animate-fade-in ${delayClass}`}
              >
              {post.enclosure?.url && (
                <img
                  src={post.enclosure.url}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  loading="lazy"
                  onError={(e) => {
                    const t = e.target as HTMLImageElement;
                    t.src = '/images/placeholder.jpg';
                  }}
                />
              )}

              <h2 className="text-xl font-bold mb-2 text-white">{post.title}</h2>
              <div className="text-xs text-gray-400 mb-3">
                <span>
                  {new Date(post.pubDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                {post.author && <span> • {post.author}</span>}
              </div>
              <p className="text-gray-300 line-clamp-3 mb-4">{post.contentSnippet}</p>

              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block glass-surface px-4 py-2 rounded-lg text-white border border-white/10"
              >
                Read More →
              </a>
            </article>
            );
            })}
          </div>
        )}
      </div>
    </section>
  );
}


