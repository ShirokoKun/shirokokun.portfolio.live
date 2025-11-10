'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface YouTubeVideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  videoUrl: string;
}

export function YouTubeVideoCard({
  id,
  title,
  thumbnail,
  publishedAt,
  viewCount,
  videoUrl,
}: YouTubeVideoCardProps) {
  // Format view count (e.g., 1234 → 1.2K)
  const formatViews = (views: string) => {
    const num = parseInt(views);
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  // Format date (e.g., "2 days ago")
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
  };

  return (
    <motion.a
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="block group cursor-pointer"
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="backdrop-blur-xl bg-zinc-900/40 border border-zinc-700/50 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-zinc-800">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            unoptimized
          />
          {/* Play button overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-2xl shadow-red-600/50">
              <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-medium line-clamp-2 mb-2 group-hover:text-red-400 transition-colors">
            {title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-zinc-400">
            <span>{formatViews(viewCount)} views</span>
            <span>•</span>
            <span>{formatDate(publishedAt)}</span>
          </div>
        </div>
      </div>
    </motion.a>
  );
}
