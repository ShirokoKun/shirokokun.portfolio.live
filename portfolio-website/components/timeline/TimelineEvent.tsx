'use client';

import { motion } from 'framer-motion';
import { TimelineEvent as TimelineEventType } from './TimelineData';
import { GlassSurface } from '@/components/ui/GlassSurface';

interface TimelineEventProps {
  event: TimelineEventType;
  index: number;
  isLast: boolean;
}

// SVG Icon Mapper
const iconMap: Record<string, JSX.Element> = {
  star: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  briefcase: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  crown: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 20h20v2H2z" />
      <path d="m12 4-4 8 4-2 4 2-4-8z" />
      <circle cx="4" cy="12" r="2" />
      <circle cx="20" cy="12" r="2" />
      <circle cx="12" cy="4" r="2" />
    </svg>
  ),
  rocket: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  users: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
  award: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  ),
  code: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  camera: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  film: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="17" x2="22" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
    </svg>
  ),
  graduation: (
    <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  )
};

export default function TimelineEvent({ event, index, isLast }: TimelineEventProps) {
  const typeBgColors: Record<string, string> = {
    education: 'bg-white/5',
    work: 'bg-white/5',
    project: 'bg-white/5',
    achievement: 'bg-white/5',
    creative: 'bg-white/5',
    leadership: 'bg-white/5',
    milestone: 'bg-white/5',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex-shrink-0 w-80 group"
    >
      <GlassSurface
        width="100%"
        height="auto"
        borderRadius={20}
        backgroundOpacity={0.03}
        blur={10}
        displace={1}
        distortionScale={-120}
        redOffset={1}
        greenOffset={5}
        blueOffset={10}
        className="h-full"
      >
        <motion.div
          className="p-6 h-full flex flex-col"
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          {/* Icon & Year */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                className={`${typeBgColors[event.type]} p-3 rounded-xl text-white`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                style={{
                  filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.1))'
                }}
              >
                <div className="w-6 h-6">
                  {event.icon && iconMap[event.icon]}
                </div>
              </motion.div>
              <div>
                <div className="text-2xl font-black text-white">
                  {event.year}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">
                  {event.type}
                </div>
              </div>
            </div>
            {event.current && (
              <motion.div
                className="px-3 py-1 rounded-full bg-white/10 border border-white/20"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(255, 255, 255, 0)',
                    '0 0 20px rgba(255, 255, 255, 0.2)',
                    '0 0 0px rgba(255, 255, 255, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-xs font-bold text-white">CURRENT</span>
              </motion.div>
            )}
          </div>

          {/* Title & Subtitle */}
          <div className="mb-4 flex-grow">
            <h3 className="text-xl font-bold text-white mb-2" style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.1), 0 2px 4px rgba(0, 0, 0, 0.5)'
            }}>
              {event.title}
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {event.subtitle}
            </p>
            {event.description && (
              <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                {event.description}
              </p>
            )}
          </div>

          {/* White Bar Indicator */}
          <motion.div
            className="h-1.5 rounded-full bg-white/20"
            whileHover={{ opacity: 1, scaleY: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.4)' }}
            transition={{ duration: 0.2 }}
            style={{
              boxShadow: '0 0 10px rgba(255, 255, 255, 0.1)'
            }}
          />
        </motion.div>
      </GlassSurface>
    </motion.div>
  );
}
