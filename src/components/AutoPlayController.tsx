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
  const [speed, setSpeed] = useState<number>(1); // 0.75x, 1x, 1.5x
  const [currentSection, setCurrentSection] = useState<string>('hero');
  const [userInteracted, setUserInteracted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Mutable refs to prevent re-instantiating the RAF loop on every state change
  const isPlayingRef = useRef(true);
  const speedRef = useRef(1);
  const isPausedRef = useRef(false);
  const cakeTriggeredRef = useRef(false);
  const surpriseTriggeredRef = useRef(false);
  const pauseTimerRef = useRef<number | null>(null);
  const sectionBoundsRef = useRef<{ id: string; top: number; bottom: number }[]>([]);
  const lastSectionRef = useRef('hero');

  const sections = ['hero', 'message', 'happy', 'gallery', 'journey', 'cake', 'final'];

  // Keep refs in sync with state
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Measure section positions passively without layout thrashing
  const updateSectionBounds = useCallback(() => {
    const bounds: { id: string; top: number; bottom: number }[] = [];
    for (const sec of sections) {
      const el = document.getElementById(sec);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        bounds.push({
          id: sec,
          top,
          bottom: top + (el.offsetHeight || rect.height),
        });
      }
    }
    if (bounds.length > 0) {
      sectionBoundsRef.current = bounds;
    }
  }, []);

  useEffect(() => {
    if (!hasEntered) return;
    // Initial measure after short delay for layouts to settle
    const t1 = setTimeout(updateSectionBounds, 300);
    const t2 = setTimeout(updateSectionBounds, 1200);

    let resizeTimer: number;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(updateSectionBounds, 200);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [hasEntered, updateSectionBounds]);

  // Smooth, high-performance scroll animation loop
  useEffect(() => {
    if (!hasEntered) return;

    let animId: number;
    let lastTime = performance.now();

    const scrollLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.05); // Cap delta to prevent jump
      lastTime = now;

      if (isPlayingRef.current && !isPausedRef.current) {
        const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        const totalHeight = scrollHeight - window.innerHeight;
        const currentY = window.scrollY;

        // Smooth pixel movement per frame
        const pixelsPerSecond = 50 * speedRef.current;
        const moveAmount = pixelsPerSecond * delta;
        window.scrollBy(0, moveAmount);

        // Detect current section with zero layout query
        const scrollMiddle = currentY + window.innerHeight * 0.45;
        let detected = 'hero';
        for (const bound of sectionBoundsRef.current) {
          if (scrollMiddle >= bound.top && scrollMiddle <= bound.bottom) {
            detected = bound.id;
            break;
          }
        }

        if (detected !== lastSectionRef.current) {
          lastSectionRef.current = detected;
          setCurrentSection(detected);

          // Gentle reading pause at Cake for hands-free candle blow
          if (detected === 'cake' && !cakeTriggeredRef.current) {
            cakeTriggeredRef.current = true;
            isPausedRef.current = true;
            if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

            // Wait 2s to center, blow candle, then wait 3s for wishes before continuing
            pauseTimerRef.current = window.setTimeout(() => {
              onTriggerCakeBlow?.();
              pauseTimerRef.current = window.setTimeout(() => {
                isPausedRef.current = false;
              }, 3200 / speedRef.current);
            }, 1800 / speedRef.current);
          }
        }

        // Check if reached the bottom of page
        if (currentY >= totalHeight - 12) {
          if (!surpriseTriggeredRef.current) {
            surpriseTriggeredRef.current = true;
            setTimeout(() => {
              onTriggerSurprise?.();
            }, 1500);
          }
          setIsPlaying(false);
          setIsFinished(true);
          return;
        }
      }

      animId = requestAnimationFrame(scrollLoop);
    };

    animId = requestAnimationFrame(scrollLoop);

    return () => {
      cancelAnimationFrame(animId);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [hasEntered, onTriggerCakeBlow, onTriggerSurprise]);

  // Detect user touch or wheel to allow temporary manual browsing without breaking auto-tour
  useEffect(() => {
    let timeout: number;
    const handleScrollInteraction = () => {
      setUserInteracted(true);
      clearTimeout(timeout);
      timeout = window.setTimeout(() => setUserInteracted(false), 4000);
    };

    window.addEventListener('wheel', handleScrollInteraction, { passive: true });
    window.addEventListener('touchmove', handleScrollInteraction, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleScrollInteraction);
      window.removeEventListener('touchmove', handleScrollInteraction);
      clearTimeout(timeout);
    };
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(p => {
      const next = !p;
      isPlayingRef.current = next;
      if (next) {
        isPausedRef.current = false;
        setIsFinished(false);
      }
      return next;
    });
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed(s => (s === 0.75 ? 1 : s === 1 ? 1.5 : 0.75));
  }, []);

  const skipToNext = useCallback(() => {
    updateSectionBounds();
    const nextIdx = (sections.indexOf(currentSection) + 1) % sections.length;
    const target = sections[nextIdx];
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentSection, updateSectionBounds]);

  const restartTour = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    cakeTriggeredRef.current = false;
    surpriseTriggeredRef.current = false;
    isPausedRef.current = false;
    lastSectionRef.current = 'hero';
    setCurrentSection('hero');
    setIsFinished(false);
    setIsPlaying(true);
    isPlayingRef.current = true;
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
            className="glass-card px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 text-purple-200 shadow-lg border border-purple-500/30"
          >
            <span>Mode Manual</span>
            <button
              onClick={() => {
                setIsPlaying(true);
                isPlayingRef.current = true;
                isPausedRef.current = false;
                setUserInteracted(false);
              }}
              className="text-pink-300 font-semibold underline ml-1 cursor-pointer hover:text-pink-200"
            >
              Lanjutkan Jalan Otomatis ✨
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Finished notification */}
      <AnimatePresence>
        {isFinished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card px-3.5 py-2 rounded-2xl text-xs flex items-center gap-2 text-pink-200 shadow-xl border border-pink-500/40"
            style={{ background: 'rgba(26, 10, 46, 0.92)' }}
          >
            <span>Perjalanan selesai ❤️</span>
            <button
              onClick={restartTour}
              className="px-2.5 py-1 rounded-xl bg-pink-500/30 hover:bg-pink-500/50 text-white font-medium cursor-pointer transition-colors"
            >
              Ulangi 🔄
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating HUD Controller */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
        className="glass-card rounded-2xl p-2 flex items-center gap-1.5 border border-purple-500/30 shadow-xl"
        style={{ background: 'rgba(18, 8, 42, 0.9)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
      >
        {/* Cinema Mode indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-purple-900/40 text-xs font-light text-purple-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
          <span className="hidden md:inline font-mono text-[11px]">
            {isPlaying ? 'Jalan Otomatis' : 'Dijeda'}
          </span>
        </div>

        {/* Play / Pause */}
        <button
          onClick={togglePlay}
          title={isPlaying ? 'Jeda jalan otomatis' : 'Lanjutkan jalan otomatis'}
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/40 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          {isPlaying ? <Pause className="w-4 h-4 text-amber-300" /> : <Play className="w-4 h-4 text-emerald-400" />}
        </button>

        {/* Speed toggle */}
        <button
          onClick={cycleSpeed}
          title="Ubah kecepatan jalan"
          className="px-2.5 py-1 text-xs rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-amber-300 font-mono font-bold transition-all cursor-pointer"
        >
          {speed}x
        </button>

        {/* Skip forward */}
        <button
          onClick={skipToNext}
          title="Lompat ke bagian berikutnya"
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          <FastForward className="w-4 h-4" />
        </button>

        {/* Restart tour */}
        <button
          onClick={restartTour}
          title="Ulangi dari awal"
          className="p-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </motion.div>
    </div>
  );
}
