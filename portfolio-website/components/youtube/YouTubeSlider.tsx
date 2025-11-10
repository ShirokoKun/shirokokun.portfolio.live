'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { YouTubeVideoCard } from './YouTubeVideoCard';
import { GlassSurface } from '@/components/ui/GlassSurface';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: string;
  videoUrl: string;
}

export function YouTubeSlider() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube/videos');
        const data = await response.json();

        if (data.success && data.videos) {
          setVideos(data.videos);
          setError(null);
        } else {
          setError('Failed to load videos');
        }
      } catch (err) {
        console.error('Error fetching YouTube videos:', err);
        setError('Failed to load videos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Auto-slide every 5 seconds
  useEffect(() => {
    if (videos.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 5000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [videos.length]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % videos.length);
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
    // Reset auto-slide timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % videos.length);
      }, 5000);
    }
  };

  if (isLoading) {
    return (
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        backgroundOpacity={0.08}
        blur={12}
        displace={2}
        distortionScale={-140}
        redOffset={2}
        greenOffset={8}
        blueOffset={15}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white" style={{
                fontFamily: 'var(--font-sora), system-ui, sans-serif',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Latest Videos
              </h3>
              <p className="text-xs text-zinc-500">From my channel</p>
            </div>
          </div>
          <div className="aspect-video bg-zinc-800/50 rounded-xl animate-pulse" />
        </div>
      </GlassSurface>
    );
  }

  if (error || videos.length === 0) {
    return (
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        backgroundOpacity={0.08}
        blur={12}
        displace={2}
        distortionScale={-140}
        redOffset={2}
        greenOffset={8}
        blueOffset={15}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white" style={{
                fontFamily: 'var(--font-sora), system-ui, sans-serif',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Latest Videos
              </h3>
              <p className="text-xs text-zinc-500">From my channel</p>
            </div>
          </div>
          <div className="text-center py-8 text-zinc-400 flex-1 flex items-center justify-center">
            No videos available
          </div>
        </div>
      </GlassSurface>
    );
  }

  return (
    <GlassSurface
      width="100%"
      height="auto"
      borderRadius={24}
      backgroundOpacity={0.08}
      blur={12}
      displace={2}
      distortionScale={-140}
      redOffset={2}
      greenOffset={8}
      blueOffset={15}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M23 7l-7 5 7 5V7z"/>
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white" style={{
                fontFamily: 'var(--font-sora), system-ui, sans-serif',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.5)'
              }}>
                Latest Videos
              </h3>
              <p className="text-xs text-zinc-500">From my channel</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={goToPrevious}
              className="w-8 h-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <motion.button
              onClick={goToNext}
              className="w-8 h-8 backdrop-blur-xl bg-white/5 border border-white/10 rounded-full flex items-center justify-center hover:bg-white/10 hover:border-white/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Video Slider */}
        <div className="relative overflow-hidden flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <YouTubeVideoCard {...videos[currentIndex]} />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          {videos.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                // Reset auto-slide timer
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = setInterval(() => {
                    setCurrentIndex((prev) => (prev + 1) % videos.length);
                  }, 5000);
                }
              }}
              className={`h-1.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'w-6 bg-white shadow-lg shadow-white/20'
                  : 'w-1.5 bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
      </div>
    </GlassSurface>
  );
}
