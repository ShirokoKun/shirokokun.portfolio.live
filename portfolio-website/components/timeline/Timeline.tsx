'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import TimelineEvent from './TimelineEvent';
import { timelineData } from './TimelineData';
import { GlassSurface } from '@/components/ui/GlassSurface';

interface TimelineProps {
  compact?: boolean;
  className?: string;
}

export default function Timeline({ compact = false, className = '' }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity }}
      className={`${className}`}
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={24}
        backgroundOpacity={0.05}
        blur={12}
        displace={2}
        distortionScale={-150}
        redOffset={2}
        greenOffset={8}
        blueOffset={15}
        className="p-8"
      >
        {/* Header with Better Typography */}
        <div className="mb-8 flex items-center gap-4">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <div>
            <motion.h2 
              className="text-4xl md:text-5xl font-black mb-2"
              style={{ 
                fontFamily: 'var(--font-sora), system-ui, sans-serif',
                letterSpacing: '-0.03em',
                color: '#ffffff',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              My Journey
            </motion.h2>
            <motion.p 
              className="text-base text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Milestones and achievements that shaped my path
            </motion.p>
          </div>
        </div>

        {/* Timeline Events - Horizontal Scroll on Desktop */}
        <div className="relative">
          <div className="overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            <div className="flex gap-6 min-w-max">
              {timelineData.map((event, index) => (
                <TimelineEvent
                  key={event.year + event.title}
                  event={event}
                  index={index}
                  isLast={index === timelineData.length - 1}
                />
              ))}
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute right-0 top-0 bottom-4 w-24 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        </div>

        {/* Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 pt-8 border-t border-white/5"
        >
          <div className="grid grid-cols-3 gap-6">
            {[
              { value: '5+', label: 'Years' },
              { value: '100+', label: 'Projects' },
              { value: '∞', label: 'Ideas' }
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center group/stat"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-black text-white mb-2" style={{
                  textShadow: '0 0 30px rgba(255, 255, 255, 0.15), 0 2px 4px rgba(0, 0, 0, 0.5)'
                }}>
                  {stat.value}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </GlassSurface>
    </motion.div>
  );
}
