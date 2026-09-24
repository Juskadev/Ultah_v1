import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';

interface SurpriseModalProps {
  onClose: () => void;
}

const STEPS = [
  { text: "Among billions of stars...", delay: 0 },
  { text: "Across countless galaxies...", delay: 2000 },
  { text: "I somehow found you.", delay: 4000, highlight: true },
  { text: "❤️", delay: 5500, isEmoji: true },
  { text: "And I would still choose you.", delay: 6500, final: true },
];

export default function SurpriseModal({ onClose }: SurpriseModalProps) {
  const [step, setStep] = useState(0);
  const [confettiFired, setConfettiFired] = useState(false);

  const startSequence = useCallback(() => {
    STEPS.forEach((s, i) => {
      setTimeout(() => {
        setStep(i + 1);
        if (s.final && !confettiFired) {
          setConfettiFired(true);
          // Heart confetti
          const end = Date.now() + 3000;
          const hearts = () => {
            confetti({
              particleCount: 20,
              startVelocity: 20,
              spread: 360,
              origin: { x: Math.random(), y: Math.random() * 0.5 },
              shapes: ['circle'],
              colors: ['#f472b6', '#fda4af', '#c084fc', '#a78bfa', '#fbbf24'],
              scalar: 1.5,
            });
            if (Date.now() < end) requestAnimationFrame(hearts);
          };
          hearts();
        }
      }, s.delay);
    });
  }, [confettiFired]);

  // Auto-start
  useState(() => { startSequence(); });

  const visibleSteps = STEPS.slice(0, step);

  return (
    <motion.div
      className="surprise-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onClick={step >= STEPS.length ? onClose : undefined}
    >
      {/* Stars */}
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={i}
          className="star"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 0.5}px`,
            height: `${Math.random() * 3 + 0.5}px`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${Math.random() * 2 + 1.5}s`,
          }}
        />
      ))}

      {/* Nebula */}
      <div className="nebula" style={{
        width: '600px', height: '600px',
        background: 'rgba(109,40,217,0.3)',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
      }} />

      <div className="relative z-10 text-center px-8 max-w-2xl">
        {visibleSteps.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-6"
          >
            {s.isEmoji ? (
              <motion.span
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{ fontSize: '60px', display: 'block' }}
              >
                {s.text}
              </motion.span>
            ) : s.final ? (
              <p className="font-script text-4xl md:text-6xl text-glow-pink" style={{ color: '#fda4af' }}>
                {s.text}
              </p>
            ) : s.highlight ? (
              <p className="font-display italic text-3xl md:text-5xl gradient-text-cosmic font-light">
                {s.text}
              </p>
            ) : (
              <p className="font-body text-xl md:text-2xl font-light" style={{ color: '#c4b5fd', letterSpacing: '0.05em' }}>
                {s.text}
              </p>
            )}
          </motion.div>
        ))}

        {step >= STEPS.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <button
              onClick={onClose}
              className="btn-cosmic px-8 py-3 text-sm"
              style={{ color: '#a78bfa' }}
            >
              Close ✨
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
