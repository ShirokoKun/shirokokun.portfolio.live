'use client';

import { motion } from 'framer-motion';
import { timelineData } from './TimelineData';

export default function CompactTimeline() {
  // Show only the first 3 most recent events
  const recentEvents = timelineData.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-zinc-900/30 p-4 rounded-xl border border-zinc-800"
    >
      {/* Compact Header */}
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          My Journey
        </h3>
      </div>

      {/* Compact Timeline events */}
      <div className="space-y-3">
        {recentEvents.map((event, index) => (
          <div key={event.year + event.title} className="relative pl-6">
            {/* Vertical line */}
            {index < recentEvents.length - 1 && (
              <div className="absolute left-1.5 top-5 bottom-0 w-px bg-zinc-700/50" />
            )}
            
            {/* Dot */}
            <div className={`absolute left-0 top-1.5 w-3 h-3 -ml-px rounded-full ${
              event.current 
                ? 'bg-green-500 ring-2 ring-green-500/30 animate-pulse' 
                : 'bg-blue-500/50 ring-1 ring-blue-500/20'
            }`} />
            
            {/* Content */}
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-white truncate">{event.title}</span>
                    {event.current && (
                      <span className="px-1.5 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400 whitespace-nowrap">
                        Now
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{event.subtitle}</p>
                </div>
                <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{event.year}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Compact Footer */}
      <div className="mt-4 pt-3 border-t border-zinc-800/50 flex justify-between text-center">
        <div>
          <div className="text-sm font-bold text-white">5+</div>
          <div className="text-xs text-zinc-500">Years</div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">100+</div>
          <div className="text-xs text-zinc-500">Projects</div>
        </div>
        <div>
          <div className="text-sm font-bold text-white">∞</div>
          <div className="text-xs text-zinc-500">Ideas</div>
        </div>
      </div>
    </motion.div>
  );
}
