'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Timeline from '@/components/timeline/Timeline';
import SpotifyWidget from '@/components/spotify/SpotifyWidget';
import StickySpotifyBar from '@/components/spotify/StickySpotifyBar';
import { YouTubeSlider } from '@/components/youtube/YouTubeSlider';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/Animations';

export default function MySpacePage() {
  const spotifyRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-black text-white">
      {/* Header from homepage */}
      <Header />

      {/* Sticky Spotify Bar */}
      <StickySpotifyBar expandTriggerRef={spotifyRef} />
      
      <main className="min-h-screen pt-32 pb-24 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Hero-style Header */}
          <FadeIn>
            <div className="text-center mb-20">
              {/* Creative MySpace Title with Icon */}
              <motion.div
                className="flex items-center justify-center gap-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Profile Icon */}
                <svg className="w-16 h-16 md:w-20 md:h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M3 21c0-4 4-7 9-7s9 3 9 7" />
                </svg>
                
                <motion.h1 
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black"
                  style={{ 
                    fontFamily: 'var(--font-sora), system-ui, sans-serif',
                    letterSpacing: '-0.02em',
                    color: '#ffffff',
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.15), 0 4px 6px rgba(0, 0, 0, 0.5)'
                  }}
                >
                  MySpace
                </motion.h1>
              </motion.div>
              
              {/* Subtitle */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-4"
              >
                <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  A personal corner of the internet where I share my journey, current vibes, and creative work
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-500">Live updates • Current projects • Creative explorations</span>
                </div>
              </motion.div>
            </div>
          </FadeIn>

          {/* New Layout: Notes/Ideas → Instagram Reels → Timeline → Spotify + YouTube */}
          <div className="space-y-12">
            {/* Section 1: Bento Grid - Ideas & Notes + Instagram Reels */}
            <StaggerContainer>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Ideas & Notes - Takes 2 columns */}
                <StaggerItem index={0} className="lg:col-span-2">
                  <motion.div 
                    className="glass-card p-8 group hover:border-yellow-500/30 h-full"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-yellow-500 group-hover:via-orange-500 group-hover:to-red-500 group-hover:border-transparent transition-all duration-300"
                      >
                        <span className="text-3xl">💡</span>
                      </motion.div>
                      <div>
                        <h2 className="text-3xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                          Ideas & Notes
                        </h2>
                        <p className="text-sm text-gray-500">Thoughts in progress</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { date: 'Nov 10, 2025', title: 'MySpace Section', text: 'Building this personal space - it\'s meta! 🚀', tag: 'Development' },
                        { date: 'Nov 8, 2025', title: 'React Flow', text: 'Mindscape graph viz is coming together beautifully!', tag: 'Project' },
                        { date: 'Nov 5, 2025', title: 'Portfolio v2', text: 'Glassmorphic design system is chef\'s kiss 👨‍🍳', tag: 'Design' },
                        { date: 'Nov 3, 2025', title: 'Next.js 14', text: 'Server components are game changers', tag: 'Tech' },
                      ].map((note, i) => (
                        <motion.div
                          key={i}
                          className="p-5 bg-zinc-900/50 rounded-xl border border-white/10 backdrop-blur-sm hover:border-yellow-500/20 hover:bg-yellow-500/5 transition-all group/note"
                          whileHover={{ y: -2 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-500 group-hover/note:bg-yellow-500/10 group-hover/note:text-yellow-500 transition-colors">
                              {note.tag}
                            </span>
                            <span className="text-xs text-gray-600">{note.date}</span>
                          </div>
                          <h3 className="text-white font-semibold mb-2 group-hover/note:text-yellow-400 transition-colors">
                            {note.title}
                          </h3>
                          <p className="text-sm text-gray-400 leading-relaxed">{note.text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </StaggerItem>

                {/* Instagram Reels - Takes 1 column */}
                <StaggerItem index={1}>
                  <motion.div 
                    className="glass-card p-8 group hover:border-pink-500/30 h-full"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-rose-500 group-hover:border-transparent transition-all duration-300"
                      >
                        <span className="text-3xl">📷</span>
                      </motion.div>
                      <div>
                        <h2 className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">
                          Instagram Reels
                        </h2>
                        <p className="text-xs text-gray-500">Latest moments</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {[1, 2, 3, 4].map((i) => (
                        <motion.div
                          key={i}
                          className="aspect-[9/16] bg-zinc-900/50 rounded-xl border border-white/10 backdrop-blur-sm hover:border-pink-500/30 hover:bg-pink-500/5 transition-all cursor-pointer overflow-hidden group/reel"
                          whileHover={{ scale: 1.02, y: -4 }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <div className="w-full h-full flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover/reel:opacity-100 transition-opacity" />
                            <span className="text-3xl opacity-30 group-hover/reel:opacity-60 transition-opacity">📸</span>
                            <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover/reel:opacity-100 transition-opacity">
                              <p className="text-xs text-white font-medium">Coming Soon</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </StaggerItem>
              </div>
            </StaggerContainer>

            {/* Section 2: Horizontal Timeline */}
            <StaggerContainer>
              <StaggerItem index={2}>
                <Timeline />
              </StaggerItem>
            </StaggerContainer>

            {/* Section 3: Spotify + YouTube Grid (Compact & Same Height) */}
            <StaggerContainer>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                {/* Spotify Widget - This is the expand trigger for sticky bar */}
                <StaggerItem index={3}>
                  <motion.div
                    ref={spotifyRef}
                    className="glass-card p-6 h-full group hover:border-green-500/30 flex flex-col"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SpotifyWidget />
                  </motion.div>
                </StaggerItem>

                {/* YouTube Videos - Wrapped in glass-card */}
                <StaggerItem index={4}>
                  <motion.div
                    className="h-full"
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <YouTubeSlider />
                  </motion.div>
                </StaggerItem>
              </div>
            </StaggerContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
