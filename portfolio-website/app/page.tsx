'use client';

import { useEffect } from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Bio from '@/components/Bio';
import ToolsAndJourney from '@/components/ToolsAndJourney';
import Metrics from '@/components/Metrics';
import ProjectsAndSkills from '@/components/ProjectsAndSkills';
import ArtworkGallery from '@/components/ArtworkGallery';
import BlogTeaser from '@/components/BlogTeaser';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    // Smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scroll performance
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Scroll handling logic can go here if needed
          ticking = false;
        });
        ticking = true;
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white">
      <Header />
      <main>
        <Hero />
        <Bio />
        <ToolsAndJourney />
        <Metrics />
        <ProjectsAndSkills />
        <ArtworkGallery />
        <BlogTeaser />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}