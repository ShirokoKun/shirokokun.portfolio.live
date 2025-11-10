'use client';

import { useRef, useEffect, useState } from 'react';
import { FadeIn, StaggerContainer, StaggerItem } from './Animations';
import { PROJECT_CATEGORIES } from '@/constants/personal';
import { 
  Image as ImageIcon, 
  Video, 
  FileText, 
  Share2,
  Palette,
  Terminal,
  TrendingUp,
  Music,
  Film,
  Code2,
  PenTool,
  BarChart,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Icon mapping for project categories
const categoryIcons: Record<string, React.ComponentType<any>> = {
  'cover-art': ImageIcon,
  'posters': FileText,
  'projects-contributions': Palette,
  'social-media-post': Share2,
  'video-editing-projects': Video,
};

const categoryColors: Record<string, string> = {
  'cover-art': 'from-purple-500 via-pink-500 to-red-500',
  'posters': 'from-blue-500 via-cyan-500 to-teal-500',
  'projects-contributions': 'from-green-500 via-emerald-500 to-teal-500',
  'social-media-post': 'from-orange-500 via-yellow-500 to-pink-500',
  'video-editing-projects': 'from-indigo-500 via-purple-500 to-pink-500',
};

const skills = [
  { 
    icon: Terminal, 
    title: "Frontend Dev",
    description: "React, Next.js, TypeScript",
    color: "from-indigo-500 via-purple-500 to-blue-500"
  },
  { 
    icon: TrendingUp, 
    title: "UI/UX Design",
    description: "Wireframes, prototypes",
    color: "from-blue-500 via-cyan-400 to-teal-500"
  },
  { 
    icon: Film, 
    title: "Video Editing",
    description: "DaVinci, After Effects",
    color: "from-teal-400 via-cyan-500 to-blue-600"
  },
  { 
    icon: Palette, 
    title: "Graphic Design",
    description: "Photoshop, Figma",
    color: "from-purple-500 via-pink-500 to-indigo-400"
  },
  { 
    icon: Music, 
    title: "Music Production",
    description: "FL Studio, sound design",
    color: "from-orange-500 via-red-500 to-pink-500"
  },
  { 
    icon: Code2, 
    title: "Creative Coding",
    description: "p5.js, generative art",
    color: "from-green-500 via-emerald-500 to-teal-500"
  },
];

export default function ProjectsAndSkills() {
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
      id="projects-skills"
      ref={sectionRef}
      className="py-12 md:py-24"
    >
      <FadeIn>
        <div className="max-w-6xl mx-auto px-8">
          {/* Two Column Bento Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* LEFT: My Projects */}
            <motion.div
              className="glass-card p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">My Projects</h2>
                <p className="text-lg text-gray-400 mb-6">
                  Creative work across different disciplines
                </p>
                <Link 
                  href="/projects"
                  className="inline-flex items-center gap-2 glass-surface px-6 py-3 rounded-full text-white font-medium hover:scale-105 transition-all group"
                >
                  <span>View All Projects</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Compact Project Categories Grid */}
              <div className="grid grid-cols-2 gap-4">
                {PROJECT_CATEGORIES.slice(0, 4).map((category, index) => {
                  const IconComponent = categoryIcons[category.id] || ImageIcon;
                  const gradientColor = categoryColors[category.id] || 'from-gray-500 to-gray-700';
                  
                  return (
                    <motion.div
                      key={category.id}
                      className="glass-surface p-4 rounded-xl cursor-pointer group hover:scale-105 transition-transform"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <Link href="/projects" className="block">
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradientColor} flex items-center justify-center mb-3`}>
                          <IconComponent className="text-white" size={24} />
                        </div>
                        <h3 className="text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors">
                          {category.title}
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2">
                          {category.description}
                        </p>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* RIGHT: What I Do */}
            <motion.div
              className="glass-card p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-8">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4">What I Do</h2>
                <p className="text-lg text-gray-400">
                  Multidisciplinary creative exploring technology & design
                </p>
              </div>
              
              {/* Compact Skills Bento Grid */}
              <div className="grid grid-cols-2 gap-4">
                {skills.map((skill, index) => {
                  const IconComponent = skill.icon;
                  return (
                    <motion.div
                      key={skill.title}
                      className="glass-surface p-4 rounded-xl group hover:scale-105 transition-transform"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isVisible ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -4 }}
                    >
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${skill.color} flex items-center justify-center mb-3`}>
                        <IconComponent className="text-white" size={20} />
                      </div>
                      <h3 className="text-base font-bold mb-1">{skill.title}</h3>
                      <p className="text-gray-500 text-xs line-clamp-2">{skill.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
