import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  clickCount: number;
}

interface SparkleTrail {
  id: number;
  x: number;
  y: number;
  char: string;
  color: string;
}

const SPARKLE_CHARS = ['✦', '✧', '⭐', '💫', '✨', '★', '♡', '❤'];
const SPARKLE_COLORS = ['#a78bfa', '#f472b6', '#67e8f9', '#fbbf24', '#fda4af'];

interface StarFieldProps {
  easterEggQuotes: string[];
}

export default function StarField({ easterEggQuotes }: StarFieldProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const [shootingStars, setShootingStars] = useState<{ id: number; top: number; delay: number; duration: number }[]>([]);
  const [sparkles, setSparkles] = useState<SparkleTrail[]>([]);
  const [showEasterEgg, setShowEasterEgg] = useState<string | null>(null);
  const sparkleIdRef = useRef(0);
  const lastSparkleTime = useRef(0);
  const isMobile = useRef(false);

  useEffect(() => {
    isMobile.current = window.innerWidth <= 768 || 'ontouchstart' in window;

    const newStars: Star[] = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 2,
      clickCount: 0,
    }));
    setStars(newStars);

    const sStars = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      top: Math.random() * 50,
      delay: i * 3 + Math.random() * 5,
      duration: Math.random() * 3 + 4,
    }));
    setShootingStars(sStars);
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isMobile.current) return;
    const now = Date.now();
    if (now - lastSparkleTime.current < 80) return;
    lastSparkleTime.current = now;

    const char = SPARKLE_CHARS[Math.floor(Math.random() * SPARKLE_CHARS.length)];
    const color = SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)];
    const id = sparkleIdRef.current++;

    setSparkles(prev => [...prev.slice(-20), { id, x: e.clientX, y: e.clientY, char, color }]);
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => s.id !== id));
    }, 600);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const handleStarClick = (id: number) => {
    setStars(prev => prev.map(s => {
      if (s.id === id) {
        const newCount = s.clickCount + 1;
        if (newCount >= 3) {
          const quote = easterEggQuotes[Math.floor(Math.random() * easterEggQuotes.length)];
          setShowEasterEgg(quote);
          setTimeout(() => setShowEasterEgg(null), 4000);
          return { ...s, clickCount: 0 };
        }
        return { ...s, clickCount: newCount };
      }
      return s;
    }));
  };

  return (
    <>
      {/* Nebulas */}
      <div className="nebula" style={{
        width: '600px', height: '600px',
        background: 'rgba(76, 29, 149, 0.25)',
        top: '-100px', left: '-100px',
      }} />
      <div className="nebula" style={{
        width: '500px', height: '500px',
        background: 'rgba(190, 24, 93, 0.15)',
        top: '30%', right: '-100px',
      }} />
      <div className="nebula" style={{
        width: '400px', height: '400px',
        background: 'rgba(6, 182, 212, 0.1)',
        bottom: '20%', left: '20%',
      }} />
      <div className="nebula" style={{
        width: '700px', height: '700px',
        background: 'rgba(109, 40, 217, 0.12)',
        bottom: '-200px', right: '10%',
      }} />

      {/* Stars */}
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          onClick={() => handleStarClick(star.id)}
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            cursor: 'pointer',
          }}
        />
      ))}

      {/* Shooting stars */}
      {shootingStars.map(ss => (
        <div
          key={ss.id}
          className="shooting-star"
          style={{
            top: `${ss.top}%`,
            left: '-200px',
            width: `${Math.random() * 100 + 80}px`,
            animationDelay: `${ss.delay}s`,
            animationDuration: `${ss.duration}s`,
          }}
        />
      ))}

      {/* Sparkle trail */}
      {sparkles.map(s => (
        <div
          key={s.id}
          className="sparkle-trail"
          style={{
            left: s.x,
            top: s.y,
            color: s.color,
            fontSize: `${Math.random() * 8 + 8}px`,
          }}
        >
          {s.char}
        </div>
      ))}

      {/* Easter egg message */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[9999] glass-strong rounded-2xl px-6 py-4 text-center max-w-sm pointer-events-none"
          >
            <p className="text-lavender font-body text-sm">{showEasterEgg}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
