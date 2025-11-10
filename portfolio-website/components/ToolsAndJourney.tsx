'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CompactTimeline from './timeline/CompactTimeline';
import CompactSpotify from './spotify/CompactSpotify';

// Import real brand icons from react-icons (matching Bio.tsx style)
import { 
  SiAdobephotoshop, 
  SiFigma, 
  SiAdobeaftereffects, 
  SiDavinciresolve, 
  SiCanva, 
  SiAdobeillustrator,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiJavascript,
  SiPython,
  SiNodedotjs
} from 'react-icons/si';

import { VscCode } from 'react-icons/vsc';

import { 
  Video, 
  Mic, 
  Cpu,
  Wand2,
  Music
} from 'lucide-react';

// Design & Creative Tools
const designTools = [
  { name: "Adobe Photoshop", icon: SiAdobephotoshop },
  { name: "Figma", icon: SiFigma },
  { name: "After Effects", icon: SiAdobeaftereffects },
  { name: "CapCut", icon: Video },
  { name: "Alight Motion", icon: Video },
  { name: "FL Studio", icon: Music },
  { name: "DaVinci Resolve", icon: SiDavinciresolve },
  { name: "TouchDesigner", icon: Cpu },
  { name: "Canva", icon: SiCanva },
  { name: "Illustrator", icon: SiAdobeillustrator }
];

// Development Tools
const devTools = [
  { name: "VS Code", icon: VscCode },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "JavaScript", icon: SiJavascript },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "Python", icon: SiPython },
  { name: "Node.js", icon: SiNodedotjs }
];

// AI & Automation Tools
const aiTools = [
  { name: "Eleven Labs", icon: Mic },
  { name: "Trae AI", icon: Cpu },
  { name: "Cursor AI", icon: Wand2 }
];

export default function ToolsAndJourney() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px', threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className={`py-8 md:py-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid lg:grid-cols-[1fr,280px] gap-6">
          {/* Left Side - Tools I Use (matching Bio.tsx style) */}
          <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800">
            <h4 className="text-lg font-semibold text-white mb-6 text-center">Tools I Use</h4>
            
            {/* Design Tools */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-400 mb-3 text-left">Design & Creative</h5>
              <div className="flex flex-wrap gap-3">
                {designTools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    className="group relative w-12 h-12 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer"
                    title={tool.name}
                    whileHover={{ scale: 1.1, y: -4 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {tool.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Development Tools */}
            <div className="mb-6">
              <h5 className="text-sm font-medium text-gray-400 mb-3 text-left">Development</h5>
              <div className="flex flex-wrap gap-3">
                {devTools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    className="group relative w-12 h-12 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer"
                    title={tool.name}
                    whileHover={{ scale: 1.1, y: -4 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (designTools.length + index) * 0.03 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {tool.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* AI & Automation Tools */}
            <div>
              <h5 className="text-sm font-medium text-gray-400 mb-3 text-left">AI & Automation</h5>
              <div className="flex flex-wrap gap-3">
                {aiTools.map((tool, index) => (
                  <motion.div 
                    key={index}
                    className="group relative w-12 h-12 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700/50 transition-all duration-300 cursor-pointer"
                    title={tool.name}
                    whileHover={{ scale: 1.1, y: -4 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (designTools.length + devTools.length + index) * 0.03 }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <tool.icon className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                      {tool.name}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Properly Compact Widgets */}
          <div className="space-y-4">
            <CompactTimeline />
            <CompactSpotify />
          </div>
        </div>
      </div>
    </section>
  );
}
