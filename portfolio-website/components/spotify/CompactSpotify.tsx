'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Music2, Play, Pause } from 'lucide-react';
import Image from 'next/image';

// Mock data
const mockTrack = {
  songName: 'Blinding Lights',
  artistName: 'The Weeknd',
  albumArt: '/images/placeholder-album.svg',
  isPlaying: true,
};

export default function CompactSpotify() {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Simulate random playing state
    const timer = setTimeout(() => {
      setIsPlaying(Math.random() > 0.5);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800"
    >
      {/* Compact Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Music2 className="w-4 h-4 text-green-500" />
            {isPlaying && (
              <motion.div
                className="absolute -inset-1 bg-green-500/20 rounded-full"
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
          <h3 className="text-sm font-semibold text-white">
            {isPlaying ? 'Now Playing' : 'Spotify'}
          </h3>
        </div>

        {/* Spotify logo */}
        <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-3 h-3 text-black" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
        </div>
      </div>

      {/* Album art and song info */}
      <div className="flex items-center gap-3">
        {/* Compact Album Art */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <div className={`relative w-full h-full rounded-lg overflow-hidden ${
            isPlaying ? 'ring-2 ring-green-500/40' : 'grayscale'
          }`}>
            <Image
              src={mockTrack.albumArt}
              alt="Album art"
              fill
              className="object-cover"
            />
          </div>
          {/* Play indicator */}
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-0.5 bg-green-500 rounded-full"
                    animate={{
                      height: ['4px', '12px', '4px'],
                    }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.15,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Song Details */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {mockTrack.songName}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {mockTrack.artistName}
          </p>
          {!isPlaying && (
            <p className="text-xs text-gray-600 mt-0.5">3 hours ago</p>
          )}
        </div>
      </div>

      {/* Compact Progress Bar (only when playing) */}
      {isPlaying && (
        <div className="mt-3">
          <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-green-500 to-green-400"
              initial={{ width: '0%' }}
              animate={{ width: '65%' }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-gray-500">2:10</span>
            <span className="text-xs text-gray-500">3:20</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
