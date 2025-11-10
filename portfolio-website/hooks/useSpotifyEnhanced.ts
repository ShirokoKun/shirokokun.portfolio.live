'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface SpotifyTrack {
  isPlaying: boolean;
  title?: string;
  artist?: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
  duration?: number;
  progress?: number;
  playedAt?: string; // ISO timestamp of when it was last played
  timeAgo?: string; // Human-readable time ago (e.g., "2 hours ago")
}

interface UseSpotifyEnhancedReturn {
  track: SpotifyTrack | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  isVisible: boolean; // Whether the component is visible
}

// Helper to calculate time ago
function getTimeAgo(timestamp: string): string {
  const now = new Date();
  const played = new Date(timestamp);
  const diffMs = now.getTime() - played.getTime();
  
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function useSpotifyEnhanced(refreshInterval = 10000): UseSpotifyEnhancedReturn {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastFetchRef = useRef<number>(0);

  // Fetch both now-playing and recently-played
  const fetchSpotifyData = useCallback(async () => {
    // Don't fetch if not visible and last fetch was less than 60 seconds ago
    if (!isVisible && Date.now() - lastFetchRef.current < 60000) {
      console.log('⏸️ Spotify: Skipping fetch (tab not visible)');
      return;
    }

    try {
      setError(null);
      lastFetchRef.current = Date.now();
      
      // Add cache-busting timestamp
      const timestamp = Date.now();
      
      // Try to get now-playing first
      const nowPlayingResponse = await fetch(`/api/spotify/now-playing?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      if (!nowPlayingResponse.ok) {
        throw new Error(`HTTP error! status: ${nowPlayingResponse.status}`);
      }

      const nowPlayingData = await nowPlayingResponse.json();
      
      // If error in response, throw it
      if (nowPlayingData.error) {
        throw new Error(nowPlayingData.error);
      }

      // If currently playing, use that data
      if (nowPlayingData.isPlaying) {
        console.log(`🎵 Spotify: Playing "${nowPlayingData.title}" by ${nowPlayingData.artist}`);
        setTrack({
          ...nowPlayingData,
          timeAgo: undefined, // Clear timeAgo when playing
        });
        setIsLoading(false);
        return;
      }

      // If not playing, get recently played
      console.log('🕒 Spotify: Not playing, fetching recently played...');
      const recentlyPlayedResponse = await fetch(`/api/spotify/recently-played?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
        },
      });

      if (recentlyPlayedResponse.ok) {
        const recentlyPlayedData = await recentlyPlayedResponse.json();
        
        if (recentlyPlayedData.error) {
          // No recently played tracks, just show not playing
          setTrack({ isPlaying: false });
        } else {
          // Calculate time ago
          const timeAgo = recentlyPlayedData.playedAt 
            ? getTimeAgo(recentlyPlayedData.playedAt)
            : undefined;

          console.log(`🕒 Spotify: Last played "${recentlyPlayedData.title}" ${timeAgo}`);
          
          setTrack({
            isPlaying: false,
            ...recentlyPlayedData,
            timeAgo,
          });
        }
      } else {
        // Fallback to not playing
        setTrack({ isPlaying: false });
      }

      setIsLoading(false);
    } catch (err) {
      console.error('❌ Error fetching Spotify data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      setIsLoading(false);
      // Set default state when error occurs
      setTrack({ isPlaying: false });
    }
  }, [isVisible]);

  // Update timeAgo every minute for recently played tracks
  useEffect(() => {
    if (track && !track.isPlaying && track.playedAt) {
      const timeAgoInterval = setInterval(() => {
        setTrack(prev => {
          if (!prev || prev.isPlaying || !prev.playedAt) return prev;
          return {
            ...prev,
            timeAgo: getTimeAgo(prev.playedAt),
          };
        });
      }, 60000); // Update every minute

      return () => clearInterval(timeAgoInterval);
    }
  }, [track]);

  // Track visibility using Page Visibility API
  useEffect(() => {
    const handleVisibilityChange = () => {
      const visible = document.visibilityState === 'visible';
      setIsVisible(visible);
      
      if (visible) {
        console.log('👁️ Spotify: Tab visible, resuming updates');
        // Fetch immediately when becoming visible
        fetchSpotifyData();
      } else {
        console.log('🙈 Spotify: Tab hidden, reducing updates');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [fetchSpotifyData]);

  // Initial fetch
  useEffect(() => {
    fetchSpotifyData();
  }, [fetchSpotifyData]);

  // Smart polling based on visibility
  useEffect(() => {
    if (refreshInterval <= 0) return;

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Adjust interval based on visibility
    const actualInterval = isVisible ? refreshInterval : refreshInterval * 6; // 6x slower when hidden

    intervalRef.current = setInterval(() => {
      fetchSpotifyData();
    }, actualInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refreshInterval, isVisible, fetchSpotifyData]);

  return {
    track,
    isLoading,
    error,
    refetch: fetchSpotifyData,
    isVisible,
  };
}
