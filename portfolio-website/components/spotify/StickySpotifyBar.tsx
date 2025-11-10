'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { GlassSurface } from '@/components/ui/GlassSurface';
import Image from 'next/image';

interface StickySpotifyBarProps {
  expandTriggerRef: React.RefObject<HTMLElement>;
}

const StickySpotifyBar = ({ expandTriggerRef }: StickySpotifyBarProps) => {
  const [isHidden, setIsHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const nowPlaying = {
    song: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    albumArt: '/images/profile.jpg',
  };

  useEffect(() => {
    const handleScroll = () => {
      if (expandTriggerRef.current) {
        const triggerRect = expandTriggerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (triggerRect.top < windowHeight * 0.6 && triggerRect.bottom > windowHeight * 0.4) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [expandTriggerRef]);

  return (
    <AnimatePresence>
      {!isHidden && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pointer-events-none"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          <div className="max-w-4xl mx-auto pointer-events-auto">
            <GlassSurface
              width="100%"
              height={80}
              borderRadius={20}
              backgroundOpacity={0.08}
              blur={12}
              displace={2}
              distortionScale={-140}
              redOffset={2}
              greenOffset={8}
              blueOffset={15}
              className="group hover:scale-[1.01] transition-transform duration-300"
            >
              <div className="w-full px-6 py-3 flex items-center gap-4">
                <motion.div
                  className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/10 flex-shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <Image
                    src={nowPlaying.albumArt}
                    alt={nowPlaying.album}
                    fill
                    className="object-cover"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <div className="flex gap-1 items-end h-4">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-green-500 rounded-full"
                            animate={{ height: ['40%', '100%', '60%', '80%'] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-base truncate group-hover:text-green-400 transition-colors">
                    {nowPlaying.song}
                  </h4>
                  <p className="text-white/60 text-sm truncate">
                    {nowPlaying.artist}
                  </p>
                </div>
                <motion.button
                  className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-green-500 flex items-center justify-center transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsPlaying(!isPlaying)}
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 text-white" fill="white" />
                  ) : (
                    <Play className="w-5 h-5 text-white" fill="white" />
                  )}
                </motion.button>
                <div className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-green-500 flex items-center justify-center transition-colors">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                  </svg>
                </div>
              </div>
            </GlassSurface>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickySpotifyBar;
