'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { Menu, X, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);

    // GSAP animation for header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
      );
    }
    
    // Trigger the name expansion animation after a delay
    const timer = setTimeout(() => {
      setExpanded(true);
    }, 1000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="fixed w-full top-0 z-50 transition-all duration-300 px-4 md:px-6 py-2">
      <div ref={headerRef} className="w-full overflow-hidden rounded-2xl">
        <div className={`w-full transition-all duration-300 glass-surface border-b border-white/10 ${isScrolled ? 'shadow-md' : ''}`}>
          <nav className="max-w-6xl mx-auto px-8 py-6 flex justify-between items-center h-full">
            <Link href="/" className="flex items-center">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ duration: 0.6 }}
                suppressHydrationWarning
              >
                {!expanded ? (
                  <motion.span 
                    className="font-sora font-semibold text-xl text-white"
                  >
                    SG
                  </motion.span>
                ) : (
                  <div className="flex items-center">
                    <motion.span 
                      initial={{ letterSpacing: "-0.5em", opacity: 0 }} 
                      animate={{ letterSpacing: "0em", opacity: 1 }} 
                      transition={{ duration: 1, delay: 0.2 }} 
                      className="font-sora font-semibold text-xl text-white"
                    >
                      Swastik
                    </motion.span>
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      transition={{ duration: 1, delay: 0.6 }} 
                      className="font-sora font-light text-xl text-gray-300 ml-1.5"
                    >
                      Gupta
                    </motion.span>
                  </div>
                )}
              </motion.div>
              <motion.div 
                className="px-2 py-0.5 bg-black/30 text-white text-xs font-medium rounded-full border border-white/20 ml-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
                transition={{ duration: 0.2 }}
              >
                Portfolio
              </motion.div>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex gap-4">
                <motion.li whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <a href="/#metrics" className="font-medium text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-full bg-black/20 inline-block transition-all">
                    Skills
                  </a>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Link href="/projects" className="font-medium text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-full bg-black/20 inline-block transition-all">
                    Projects
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Link href="/blog" className="font-medium text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-full bg-black/20 inline-block transition-all">
                    Blog
                  </Link>
                </motion.li>
                <motion.li whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <Link href="/myspace" className="font-medium text-white hover:text-white hover:bg-white/10 px-4 py-2 rounded-full bg-black/20 inline-block transition-all">
                    MySpace
                  </Link>
                </motion.li>
              </ul>
              
              <div className="flex items-center gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link href="/contact" className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium rounded-full shadow-md hover:shadow-lg transition-all">
                    <Mail size={16} />
                    <span>Contact</span>
                  </Link>
                </motion.div>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full bg-black/20 text-white hover:bg-black/30 transition-colors"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
          
          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div 
              className="md:hidden py-4 px-8 border-t border-white/5"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ul className="flex flex-col gap-3">
                <li>
                  <a 
                    href="/#metrics" 
                    className="font-medium text-white hover:text-white block py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Skills
                  </a>
                </li>
                <li>
                  <Link 
                    href="/projects" 
                    className="font-medium text-white hover:text-white block py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Projects
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/blog" 
                    className="font-medium text-white hover:text-white block py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/myspace" 
                    className="font-medium text-white hover:text-white block py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    MySpace
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/contact" 
                    className="font-medium text-white hover:text-white block py-2 px-4 rounded-lg hover:bg-white/5 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}