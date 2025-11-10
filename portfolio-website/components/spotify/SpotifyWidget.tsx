'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Music2 } from 'lucide-react';
import NowPlaying from './NowPlaying';
import LastPlayed from './LastPlayed';
import { useSpotify } from '@/hooks/useSpotify';

interface SpotifyWidgetProps {
  className?: string;
}

// Helper function to format time
const formatTime = (ms?: number): string => {
  if (!ms) return '0:00';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export default function SpotifyWidget({ className = '' }: SpotifyWidgetProps) {
  // Fetch Spotify data with 10-second refresh for real-time updates
  const { track, isLoading, error } = useSpotify(10000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`group ${className}`}
    >
      {/* Header - White icon, shows green on hover */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Music2 className={`w-6 h-6 transition-colors ${track?.isPlaying ? 'text-white group-hover:text-green-500' : 'text-white/50 group-hover:text-white'}`} />
            {track?.isPlaying && (
              <motion.div
                className="absolute -inset-1 bg-white/10 group-hover:bg-green-500/20 rounded-full transition-colors"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {track?.isPlaying ? '🎵 Now Playing' : '🎧 Spotify'}
            </h2>
            <p className="text-xs text-zinc-500">
              {track?.isPlaying ? 'Live from Spotify' : isLoading ? 'Loading...' : 'Not playing'}
            </p>
          </div>
        </div>

        {/* Spotify logo - White, shows green on hover */}
        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-green-500 border border-white/20 group-hover:border-transparent flex items-center justify-center transition-all">
          <svg className="w-5 h-5 text-white group-hover:text-black transition-colors" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500" />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-8 text-center"
          >
            <p className="text-red-400 text-sm mb-2">Failed to load Spotify data</p>
            <p className="text-zinc-600 text-xs">{error}</p>
          </motion.div>
        ) : track?.isPlaying ? (
          <motion.div
            key="playing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <NowPlaying
              songName={track.title || 'Unknown Track'}
              artistName={track.artist || 'Unknown Artist'}
              albumArt={track.albumImageUrl || '/images/placeholder-album.svg'}
              progress={track.progress && track.duration ? Math.round((track.progress / track.duration) * 100) : 0}
              duration={formatTime(track.duration)}
              currentTime={formatTime(track.progress)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="not-playing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="py-8 text-center"
          >
            <p className="text-zinc-400 text-sm">Not currently playing</p>
            <p className="text-zinc-600 text-xs mt-1">Check back soon! 🎵</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-6 pt-4 border-t border-zinc-800/50"
      >
        <p className="text-xs text-zinc-600 text-center">
          Powered by Spotify API • Updates every 10s
        </p>
      </motion.div>
    </motion.div>
  );
}
