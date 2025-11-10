'use client';

import { motion } from 'framer-motion';
import { Clock, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface LastPlayedProps {
  songName: string;
  artistName: string;
  albumArt: string;
  playedAt: string;
  spotifyUrl?: string;
}

export default function LastPlayed({
  songName,
  artistName,
  albumArt,
  playedAt,
  spotifyUrl,
}: LastPlayedProps) {
  return (
    <div className="space-y-4">
      {/* Album Art - Faded */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative aspect-square rounded-2xl overflow-hidden shadow-xl opacity-60"
      >
        <Image
          src={albumArt}
          alt={`${songName} album art`}
          fill
          className="object-cover grayscale"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]" />
        
        {/* Not playing indicator */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur-md bg-zinc-800/90 px-4 py-2 rounded-full">
          <span className="text-sm font-medium text-zinc-300">🎧 Offline</span>
        </div>
      </motion.div>

      {/* Last Played Info */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-zinc-500" />
          <span className="text-xs text-zinc-500">Last played</span>
        </div>
        
        <motion.h3
          className="text-lg font-bold text-zinc-300 mb-1 line-clamp-1"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {songName}
        </motion.h3>
        <motion.p
          className="text-sm text-zinc-500 line-clamp-1"
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          by {artistName}
        </motion.p>
      </div>

      {/* Time ago */}
      <div className="pt-4 border-t border-zinc-800/50">
        <p className="text-xs text-zinc-600 mb-3">{playedAt}</p>
        
        {/* View on Spotify button */}
        {spotifyUrl && (
          <motion.a
            href={spotifyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-green-400 transition-colors group"
            whileHover={{ x: 2 }}
          >
            <span>View on Spotify</span>
            <ExternalLink className="w-3 h-3 group-hover:text-green-400" />
          </motion.a>
        )}
      </div>
    </div>
  );
}
