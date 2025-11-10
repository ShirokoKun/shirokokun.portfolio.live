'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  duration?: number;
  progress?: number;
}

interface UseSpotifyReturn {
  track: SpotifyTrack | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSpotify(refreshInterval = 30000): UseSpotifyReturn {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNowPlaying = useCallback(async () => {
    try {
      setError(null);
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/spotify/now-playing?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Handle error response from API
      if (data.error) {
        console.warn('Spotify API error:', data.error);
        throw new Error(data.error);
      }

      console.log('Spotify data fetched:', {
        isPlaying: data.isPlaying,
        title: data.title,
        timestamp: new Date().toISOString(),
      });

      setTrack(data);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching Spotify now playing:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      setIsLoading(false);
      // Set default state when error occurs
      setTrack({ isPlaying: false });
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchNowPlaying();
  }, [fetchNowPlaying]);

  // Auto-refresh polling
  useEffect(() => {
    if (refreshInterval <= 0) return;

    const interval = setInterval(() => {
      fetchNowPlaying();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchNowPlaying]);

  return {
    track,
    isLoading,
    error,
    refetch: fetchNowPlaying,
  };
}
