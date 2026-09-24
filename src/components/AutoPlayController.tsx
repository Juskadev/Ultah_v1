import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, FastForward, Sparkles, RotateCcw } from 'lucide-react';

interface AutoPlayControllerProps {
  hasEntered: boolean;
  onTriggerCakeBlow?: () => void;
  onTriggerSurprise?: () => void;
}

export default function AutoPlayController({
  hasEntered,
  onTriggerCakeBlow,
  onTriggerSurprise,
}: AutoPlayControllerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState<number>(1); // 0.5, 1, 1.5
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [userInteracted, setUserInteracted] = useState(false);

  const cakeTriggeredRef = useRef(false);
  const surpriseTriggeredRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);
  const isPausedForReadingRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const sectionBoundsRef = useRef<{ id: string; top: number; bottom: number }[]>([]);
  const lastBoundsUpdateRef = useRef(0);

  const sections = ['hero', 'message', 'gallery', 'journey', 'cake', 'final'];

  // Cache section positions to avoid layout thrashing
  const updateSectionBounds = useCallback(() => {
    const bounds: { id: string; top: number; bottom: number }[] = [];
    for (const sec of sections) {
      const el = document.getElementById(sec);
      if (el) {
        const top = el.offsetTop;
        bounds.push({
          id: sec,
          top,
          bottom: top + el.offsetHeight,
        });
      }
    }
    sectionBoundsRef.current = bounds;
    lastBoundsUpdateRef.current = performance.now();
  }, []);

  useEffect(() => {
    updateSectionBounds();
    window.addEventListener('resize', updateSectionBounds);
    return () => window.removeEventListener('resize', updateSectionBounds);
  }, [updateSectionBounds]);

  // Ultra-smooth frame-rate independent auto-scroll loop (60 FPS on iOS/Android)
  useEffect(() => {
    if (!hasEntered || !isPlaying) return;

    let animId: number;
    let lastTime = performance.now();

    const scrollStep = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Update bounds periodically without blocking
      if (now - lastBoundsUpdateRef.current > 800) {
        updateSectionBounds();
      }

      if (!isPausedForReadingRef.current) {
        // Smooth target scroll pixels per second
        const pixelsPerSecond = 55 * speed;
        const scrollAmount = pixelsPerSecond * delta;
        window.scrollBy(0, scrollAmount);

        const currentY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

        // Detect current section using cached bounds
        const scrollMiddle = currentY + window.innerHeight * 0.45;
        let detected = 'hero';
        for (const bound of sectionBoundsRef.current) {
          if (scrollMiddle >= bound.top && scrollMiddle <= bound.bottom) {
            detected = bound.id;
            break;
          }
        }

        if (detected !== currentSection) {
          setCurrentSection(detected);

          // Section reading pauses
          if (detected === 'message' && !isPausedForReadingRef.current) {
            isPausedForReadingRef.current = true;
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = window.setTimeout(() => {
              isPausedForReadingRef.current = false;
            }, 6000 / speed);
          } else if (detected === 'cake' && !cakeTriggeredRef.current) {
            cakeTriggeredRef.current = true;
            isPausedForReadingRef.current = true;
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = window.setTimeout(() => {
              onTriggerCakeBlow?.();
              setTimeout(() => {
                isPausedForReadingRef.current = false;
              }, 4500 / speed);
            }, 2500 / speed);
          } else if (detected === 'final' && currentY >= totalHeight - 120 && !surpriseTriggeredRef.current) {
            surpriseTriggeredRef.current = true;
            setTimeout(() => {
              onTriggerSurprise?.();
            }, 3000 / speed);
          }
        }

        // Loop or finish
        if (currentY >= totalHeight - 10) {
          setIsPlaying(false);
          return;
        }
      }

      animId = requestAnimationFrame(scrollStep);
    };

    animId = requestAnimationFrame(scrollStep);

    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [hasEntered, isPlaying, speed, currentSection, onTriggerCakeBlow, onTriggerSurprise, updateSectionBounds]);

  // Detect manual user scrolling to notify user they can pause or resume
  useEffect(() => {
    let timeout: number;
    const handleScroll = () => {
      const diff = Math.abs(window.scrollY - lastScrollYRef.current);
      if (diff > 18) {
        setUserInteracted(true);
        clearTimeout(timeout);
        timeout = window.setTimeout(() => setUserInteracted(false), 5000);
      }
      lastScrollYRef.current = window.scrollY;
    };

    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      clearTimeout(timeout);
    };
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(p => !p);
    isPausedForReadingRef.current = false;
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed(s => (s === 0.5 ? 1 : s === 1 ? 1.5 : 0.5));
  }, []);

  const skipToNext = useCallback(() => {
    const nextIdx = (sections.indexOf(currentSection) + 1) % sections.length;
    const target = sections[nextIdx];
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSection]);

  const restartTour = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    cakeTriggeredRef.current = false;
    surpriseTriggeredRef.current = false;
    isPausedForReadingRef.current = false;
    setIsPlaying(true);
  }, []);

  if (!hasEntered) return null;

  return (
    <div className="fixed top-20 right-3 sm:right-4 z-40 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Mini notification when user scrolled manually */}
      <AnimatePresence>
        {userInteracted && !isPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="glass-card px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 text-purple-200 shadow-lg"
          >
            <span>Manual mode</span>
            <button
              onClick={() => { setIsPlaying(true); setUserInteracted(false); }}
              className="text-pink-300 font-semibold underline ml-1 cursor-pointer"
            >
              Resume Auto-Tour
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Controller */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="glass-card rounded-2xl p-2 flex items-center gap-1.5 border border-purple-500/30 shadow-xl"
        style={{ background: 'rgba(18, 8, 42, 0.85)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
      >
        {/* Cinema Mode indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-900/40 text-xs font-light text-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden md:inline font-mono">
            {isPlaying ? 'Auto-Cinema' : 'Paused'}
          </span>
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          title={isPlaying ? 'Pause Auto-Tour' : 'Play Auto-Tour'}
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Speed toggle */}
        <button
          onClick={cycleSpeed}
          title="Change playback speed"
          className="px-2.5 py-1 text-xs rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-amber-300 font-mono font-bold transition-all cursor-pointer"
        >
          {speed}x
        </button>

        {/* Skip forward */}
        <button
          onClick={skipToNext}
          title="Next section"
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          <FastForward className="w-4 h-4" />
        </button>

        {/* Restart tour */}
        <button
          onClick={restartTour}
          title="Restart from beginning"
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
