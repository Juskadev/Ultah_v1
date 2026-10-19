import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface StarFieldProps {
  easterEggQuotes?: string[];
}

export default function StarField({ easterEggQuotes = [] }: StarFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showEasterEgg, setShowEasterEgg] = useState<string | null>(null);

  // Click on canvas to trigger occasional easter egg quote
  const handleCanvasClick = () => {
    if (easterEggQuotes.length > 0) {
      const q = easterEggQuotes[Math.floor(Math.random() * easterEggQuotes.length)];
      setShowEasterEgg(q);
      setTimeout(() => setShowEasterEgg(null), 3500);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const isMobile = width < 768 || 'ontouchstart' in window;

    const starCount = isMobile ? 40 : 80;
    const colors = ['#ffffff', '#f472b6', '#a78bfa', '#fbbf24', '#67e8f9'];
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.015 + 0.005,
      colorIndex: Math.floor(Math.random() * colors.length),
    }));

    let animId: number;
    let lastRender = 0;

    const render = (now: number) => {
      // Throttle canvas to 30-40fps for background stars to save CPU/battery while remaining visually smooth
      if (now - lastRender < 24) {
        animId = requestAnimationFrame(render);
        return;
      }
      lastRender = now;

      ctx.clearRect(0, 0, width, height);

      // Group draw calls by color to reduce context state switches
      for (let c = 0; c < colors.length; c++) {
        ctx.fillStyle = colors[c];
        ctx.beginPath();
        for (let i = 0; i < starCount; i++) {
          const s = stars[i];
          if (s.colorIndex !== c) continue;

          s.alpha += s.speed;
          if (s.alpha > 1 || s.alpha < 0.2) {
            s.speed = -s.speed;
          }

          ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
          ctx.moveTo(s.x + s.size, s.y);
          ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ willChange: 'transform' }}
      />

      {/* Easter Egg Floating Banner */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[99999] glass-strong p-6 rounded-3xl text-center max-w-sm border border-pink-500/40 shadow-2xl pointer-events-auto"
            onClick={() => setShowEasterEgg(null)}
          >
            <p className="font-script text-2xl text-glow-pink mb-2" style={{ color: '#f472b6' }}>
              Pesan Rahasia Kosmik ✨
            </p>
            <p className="font-display italic text-base text-purple-200">
              "{showEasterEgg}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
