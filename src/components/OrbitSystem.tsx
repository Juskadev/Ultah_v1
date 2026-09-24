import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass } from 'lucide-react';
import Cosmic3DScene from './Cosmic3DScene';

interface Photo {
  src: string;
  caption: string;
}

interface OrbitSystemProps {
  photos: Photo[];
  heroTitle: string;
  heroSubtitle: string;
  onPhotoClick: (index: number) => void;
}

export default function OrbitSystem({ photos, heroTitle, heroSubtitle, onPhotoClick }: OrbitSystemProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track scroll for 3D camera travel
  useEffect(() => {
    const handleScroll = () => {
      const hero = document.getElementById('hero');
      if (hero) {
        const rect = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -rect.top / (rect.height || 1)));
        setScrollProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Real 3D WebGL Cosmic Scene */}
      <div className="absolute inset-0 z-0">
        <Cosmic3DScene
          photos={photos}
          onPhotoClick={onPhotoClick}
          scrollProgress={scrollProgress}
        />
      </div>

      {/* Floating 3D Badge Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-200 text-xs backdrop-blur-md"
      >
        <Compass className="w-3.5 h-3.5 text-pink-400 animate-spin" style={{ animationDuration: '10s' }} />
        <span className="font-mono text-[11px] tracking-wider uppercase">
          3D Cosmic Orbit — Arahkan kursor / klik foto
        </span>
      </motion.div>

      {/* Foreground Hero Text (Centered with glass effect) */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pointer-events-none mt-40 md:mt-48">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mb-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/30 text-pink-300 text-xs tracking-widest uppercase font-medium backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" /> Center of My Universe
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="font-display text-4xl sm:text-6xl md:text-7xl font-extralight tracking-tight text-white mb-6 whitespace-pre-line drop-shadow-[0_0_35px_rgba(244,114,182,0.4)]"
          style={{ letterSpacing: '0.04em', lineHeight: 1.15 }}
        >
          {heroTitle}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="font-display italic text-lg sm:text-xl md:text-2xl font-light text-purple-200/90 mb-8 max-w-xl mx-auto drop-shadow-md"
        >
          "{heroSubtitle}"
        </motion.p>

        {/* Quick Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="text-xs text-purple-300/80 font-body flex items-center justify-center gap-2"
        >
          <span>✦ Foto-foto kenangan berputar di orbit 3D secara otomatis ✦</span>
        </motion.div>
      </div>

      {/* Bottom Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 pointer-events-none"
      >
        <span className="text-[11px] font-mono tracking-widest text-purple-300/60 uppercase">
          Perjalanan Berlanjut
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 rounded-full border border-purple-400/40 flex items-start justify-center p-1"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-pink-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
