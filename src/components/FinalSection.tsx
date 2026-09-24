import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import confetti from 'canvas-confetti';

interface FinalSectionProps {
  senderName: string;
  finalMessage: string;
  closingWords: string;
  partnerName?: string;
  watermarkText?: string;
  showWatermark?: boolean;
  sellerContact?: string;
}

export default function FinalSection({
  senderName,
  finalMessage,
  closingWords,
  partnerName,
  watermarkText = "By Jus_Romance",
  showWatermark = true,
  sellerContact = "https://instagram.com/jus_romance",
}: FinalSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Fire confetti when section comes into view
  const confettiFiredRef = useRef(false);
  useInView(ref, {
    once: true,
    margin: '-50px',
  });

  if (isInView && !confettiFiredRef.current) {
    confettiFiredRef.current = true;
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#f472b6', '#a78bfa', '#fbbf24', '#67e8f9', '#fda4af'],
      });
    }, 500);
  }

  return (
    <section ref={ref} id="final" className="relative py-32 px-4 overflow-hidden min-h-screen flex flex-col items-center justify-center">
      {/* Enhanced background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center bottom, rgba(109,40,217,0.2) 0%, transparent 70%)',
        }} />
        {/* Floating hearts */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 16 + 10}px`,
              opacity: 0.15,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.25, 0.1],
              rotate: [0, 15, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {['❤', '♡', '✨', '★'][Math.floor(Math.random() * 4)]}
          </motion.div>
        ))}
        {/* Shooting star big */}
        <motion.div
          style={{
            position: 'absolute',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
            borderRadius: '999px',
            top: '20%',
            left: '-300px',
            width: '200px',
          }}
          animate={{ x: ['0px', '120vw'], opacity: [0, 1, 0] }}
          transition={{ duration: 3, delay: 1, repeat: Infinity, repeatDelay: 8, ease: 'linear' }}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* TO BE CONTINUED */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <p className="font-body text-sm tracking-[0.4em] mb-6" style={{ color: '#64748b' }}>
            ◦ ◦ ◦
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-light gradient-text-cosmic mb-4" style={{ letterSpacing: '0.1em' }}>
            TO BE CONTINUED...
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-10"
        >
          <p className="font-display italic text-xl md:text-2xl font-light mb-4" style={{ color: '#c4b5fd' }}>
            "{finalMessage}"
          </p>
          <div style={{
            width: '60px', height: '1px',
            background: 'linear-gradient(90deg, transparent, #a78bfa, transparent)',
            margin: '24px auto',
          }} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass-strong rounded-3xl p-10 mb-10"
          style={{ border: '1px solid rgba(167,139,250,0.15)' }}
        >
          <p className="font-script text-4xl md:text-5xl mb-3 text-glow-pink" style={{ color: '#f9a8d4' }}>
            Happy Birthday, {partnerName || 'My Love'} ❤️
          </p>
          <div style={{
            width: '60px', height: '1px',
            background: 'linear-gradient(90deg, transparent, #f472b6, transparent)',
            margin: '16px auto',
          }} />
          <p className="font-body text-base font-light" style={{ color: '#94a3b8', marginBottom: '24px' }}>
            {closingWords}
          </p>
          <div className="text-center">
            <p className="font-display italic text-base font-light" style={{ color: '#94a3b8' }}>
              With all my love,
            </p>
            <p className="font-script text-3xl mt-1 text-glow-gold" style={{ color: '#fbbf24' }}>
              {senderName} ❤️
            </p>
          </div>
        </motion.div>

        {/* Floating emojis */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="flex justify-center gap-4 text-2xl mb-10"
        >
          {['🌌', '✨', '❤️', '🌟', '💫', '❤️', '✨', '🌙'].map((e, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 2.5, delay: i * 0.15, repeat: Infinity }}
            >
              {e}
            </motion.span>
          ))}
        </motion.div>

        {/* Footer & Watermark By Jus_Romance */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="font-body text-xs tracking-widest" style={{ color: '#475569' }}>
            Made with love, memories, and a little bit of stardust ✨
          </p>

          {showWatermark && (
            <div className="mt-4 pt-4 border-t border-purple-500/20 flex flex-col items-center gap-1">
              <span className="font-script text-3xl text-glow-pink" style={{ color: '#f472b6' }}>
                {watermarkText || 'By Jus_Romance'}
              </span>
              <a
                href={sellerContact}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[10px] tracking-[0.25em] uppercase text-purple-400/60 hover:text-pink-300 transition-colors"
                style={{ textDecoration: 'none' }}
              >
                Exclusive Romantic Web Experience ✦ {watermarkText}
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
