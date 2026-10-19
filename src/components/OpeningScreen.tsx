import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface OpeningScreenProps {
  openingLine: string;
  openingTitle: string;
  onEnter: () => void;
}

export default function OpeningScreen({ openingLine, openingTitle, onEnter }: OpeningScreenProps) {
  const [leaving, setLeaving] = useState(false);
  const [countdown, setCountdown] = useState(2);

  const handleEnter = () => {
    if (leaving) return;
    setLeaving(true);
    window.dispatchEvent(new CustomEvent('cosmic_play_music'));
    setTimeout(onEnter, 800);
  };

  // Auto-enter countdown: automatically enter without needing any click!
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleEnter();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {!leaving ? (
        <motion.div
          key="opening"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center text-center px-6"
          style={{ background: 'radial-gradient(ellipse at center, #420b28 0%, #1a0410 100%)' }}
        >
          {/* Stars in opening */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 2 + 0.5}px`,
                height: `${Math.random() * 2 + 0.5}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          ))}

          {/* Nebula glow */}
          <div
            className="nebula"
            style={{
              width: '500px',
              height: '500px',
              background: 'rgba(109, 40, 217, 0.3)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative z-10 max-w-xl mx-auto flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
              className="mb-6 p-4 rounded-full bg-purple-900/40 border border-purple-500/30 text-amber-300"
            >
              <Sparkles className="w-8 h-8 animate-pulse text-pink-400" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="font-display text-xl md:text-2xl font-light italic mb-6"
              style={{ color: '#c4b5fd', letterSpacing: '0.05em', lineHeight: 1.6 }}
            >
              "{openingLine}"
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="font-script text-5xl md:text-7xl mb-8 text-glow-pink"
              style={{ color: '#f9a8d4' }}
            >
              {openingTitle}
            </motion.h1>

            {/* Auto countdown indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="w-64 mb-6"
            >
              <div className="flex justify-between items-center text-xs text-purple-300/80 mb-2 font-mono">
                <span>Memulai perjalanan kosmik...</span>
                <span className="text-pink-400 font-bold">{countdown}s</span>
              </div>
              <div className="w-full h-1.5 bg-purple-950/80 rounded-full overflow-hidden border border-purple-500/30">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 2, ease: 'linear' }}
                />
              </div>
            </motion.div>

            {/* Enter Button (Instant click option) */}
            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleEnter}
              className="btn-primary px-8 py-3.5 text-base cursor-pointer"
            >
              <span>Mulai Sekarang ✨</span>
            </motion.button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="transition"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, #ffffff 0%, #1a0533 20%, #0a0e1a 100%)' }}
        />
      )}
    </AnimatePresence>
  );
}
