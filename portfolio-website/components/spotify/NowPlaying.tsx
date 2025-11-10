'use client';

import { motion } from 'framer-motion';
import { Music, Play, Volume2 } from 'lucide-react';
import Image from 'next/image';

interface NowPlayingProps {
  songName: string;
  artistName: string;
  albumArt: string;
  progress: number; // 0-100
  duration: string;
  currentTime: string;
}

export default function NowPlaying({
  songName,
  artistName,
  albumArt,
  progress,
  duration,
  currentTime,
}: NowPlayingProps) {
  return (
    <div className="space-y-4">
      {/* Album Art */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl"
      >
        <Image
          src={albumArt}
          alt={`${songName} album art`}
          fill
          className="object-cover"
        />
        {/* Pulsing border effect */}
        <motion.div
          className="absolute inset-0 border-2 border-green-500/50 rounded-2xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        
        {/* Playing indicator */}
        <div className="absolute top-3 right-3 backdrop-blur-md bg-green-500/90 px-3 py-1 rounded-full flex items-center gap-2">
          <div className="flex gap-0.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-0.5 bg-white rounded-full"
                animate={{
                  height: ['8px', '16px', '8px'],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-white">Playing</span>
        </div>
      </motion.div>

      {/* Song Info */}
      <div>
        <motion.h3
          className="text-lg font-bold text-white mb-1 line-clamp-1"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {songName}
        </motion.h3>
        <motion.p
          className="text-sm text-zinc-400 line-clamp-1"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {artistName}
        </motion.p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="relative h-1 bg-zinc-800 rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-green-500 to-green-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Progress dot */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg"
            style={{ left: `${progress}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          />
        </div>

        {/* Time indicators */}
        <div className="flex justify-between text-xs text-zinc-500 font-mono">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Volume indicator */}
      <div className="flex items-center gap-2 text-zinc-400">
        <Volume2 className="w-4 h-4" />
        <div className="flex-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-zinc-600 rounded-full" />
        </div>
      </div>
    </div>
  );
}
