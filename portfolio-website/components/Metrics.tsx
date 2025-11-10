'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Code, Eye, Users, Clock } from 'lucide-react';
import { PieChart, Pie, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PERSONAL_INFO } from '@/constants/personal';

interface Stat {
  label: string;
  value: number;
  icon: JSX.Element;
}

interface Skill {
  name: string;
  percentage: number;
}

interface Project {
  name: string;
  value: number;
}

interface TimelineData {
  year: string;
  projects: number;
}

const Metrics = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'projects'>('overview');
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setAnimate(true);
  }, []);

  // Statistics data from personal info
  const stats: Stat[] = PERSONAL_INFO.stats.map((stat, index) => {
    const iconComponents = [Eye, Users, Activity, Clock];
    const IconComponent = iconComponents[index] || Code;
    return {
      label: stat.label,
      value: parseInt(stat.value.replace('+', '')),
      icon: <IconComponent key={`icon-${index}`} size={18} />
    };
  });

  // Skills data based on Swastik Gupta's information
  const skills: Skill[] = [
    { name: 'Video Editing', percentage: 95 },
    { name: 'Photography', percentage: 90 },
    { name: 'Graphic Design', percentage: 85 },
    { name: 'UI/UX Design', percentage: 80 },
    { name: 'Frontend Development', percentage: 75 },
    { name: 'Motion Graphics', percentage: 70 },
  ];

  // Project distribution data
  const projectData: Project[] = [
    { name: 'Video Production', value: 40 },
    { name: 'Web Development', value: 25 },
    { name: 'Design', value: 20 },
    { name: 'Photography', value: 15 },
  ];

  // Timeline data for project growth
  const timelineData: TimelineData[] = [
    { year: '2019', projects: 5 },
    { year: '2020', projects: 12 },
    { year: '2021', projects: 20 },
    { year: '2022', projects: 35 },
    { year: '2023', projects: 50 },
  ];

  const renderSkillBar = (skill: Skill, index: number) => (
    <motion.div
      key={skill.name}
      initial={{ opacity: 0, y: 20 }}
      animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-surface p-4 rounded-lg mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white font-medium">{skill.name}</h3>
        <span className="text-gray-300">{skill.percentage}%</span>
      </div>
      <div className="h-2 bg-zinc-700/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={animate ? { width: `${skill.percentage}%` } : { width: 0 }}
          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          className="h-full bg-purple-600 rounded-full"
        />
      </div>
    </motion.div>
  );

  // No additional state needed as we're using the single 'animate' state

  return (
    <section className="py-12 md:py-24 px-4 md:px-8" id="metrics">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-white">Skills & Metrics</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A data-driven overview of my creative journey and technical expertise.
          </p>
        </motion.div>

        <div
          className="glass-card p-6 md:p-8"
        >
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-purple-900/50 text-white border border-purple-700/50' : 'text-gray-300 hover:bg-zinc-800'}`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'skills' ? 'bg-purple-900/50 text-white border border-purple-700/50' : 'text-gray-300 hover:bg-zinc-800'}`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-purple-900/50 text-white border border-purple-700/50' : 'text-gray-300 hover:bg-zinc-800'}`}
          >
            Projects
          </button>
        </div>

        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={animate ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-4 md:p-6 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-lg bg-purple-900/50 text-white">
                      {stat.icon}
                    </div>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={animate ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                      className="text-3xl font-bold text-white flex items-center gap-1"
                    >
                      {stat.value}
                      <span className="text-xl text-purple-400">+</span>
                    </motion.span>
                  </div>
                  <h3 className="text-gray-300 font-medium">{stat.label}</h3>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full bg-purple-500/10 blur-xl"></div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'skills' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            {skills.map((skill, index) => renderSkillBar(skill, index))}
          </motion.div>
        )}

        {activeTab === 'projects' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-6 text-white text-center">Project Distribution</h3>
              <div className="space-y-4">
                {projectData.map((project, index) => (
                  <div key={project.name} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">{project.name}</h3>
                      <span className="text-gray-300">{project.value}%</span>
                    </div>
                    <div className="h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={animate ? { width: `${project.value}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        className={`h-full rounded-full ${index === 0 ? 'bg-purple-500' : index === 1 ? 'bg-purple-400' : index === 2 ? 'bg-purple-300' : 'bg-purple-600'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-6 text-white text-center">Project Growth</h3>
              <div className="space-y-4">
                {timelineData.map((data, index) => (
                  <div key={data.year} className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-white font-medium">{data.year}</h3>
                      <span className="text-gray-300">{data.projects} Projects</span>
                    </div>
                    <div className="h-2 bg-zinc-700/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={animate ? { width: `${(data.projects / 50) * 100}%` } : { width: 0 }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                        className="h-full bg-purple-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        </div>
      </div>
    </section>
  );
};

export default Metrics;