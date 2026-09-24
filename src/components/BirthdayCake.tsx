import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useCallback, useEffect } from 'react';
import confetti from 'canvas-confetti';

interface BirthdayCakeProps {
  candleMessage: string;
  wishResponse: string;
  triggerBlow?: boolean;
}

const CANDLE_POSITIONS = [
  { x: 22, color: '#f472b6' },
  { x: 35, color: '#a78bfa' },
  { x: 50, color: '#fbbf24' },
  { x: 65, color: '#67e8f9' },
  { x: 78, color: '#f472b6' },
];

function Candle({ x, color, blown }: { x: number; color: string; blown: boolean }) {
  return (
    <div
      style={{
        position: 'absolute',
        left: `${x}%`,
        bottom: '100%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Flame */}
      <AnimatePresence>
        {!blown && (
          <motion.div
            initial={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.3 }}
            className="candle-flame"
            style={{
              width: '10px',
              height: '16px',
              background: `radial-gradient(ellipse at 50% 60%, white 0%, ${color} 40%, rgba(251,191,36,0) 100%)`,
              borderRadius: '50% 50% 30% 30%',
              filter: `drop-shadow(0 0 6px ${color})`,
              marginBottom: '-2px',
            }}
          />
        )}
      </AnimatePresence>

      {/* Candle stick */}
      <div
        style={{
          width: '8px',
          height: '32px',
          background: `linear-gradient(180deg, ${color}80, ${color}40)`,
          borderRadius: '2px 2px 0 0',
          border: `1px solid ${color}40`,
        }}
      />
    </div>
  );
}

export default function BirthdayCake({
  candleMessage,
  wishResponse,
  triggerBlow = false,
}: BirthdayCakeProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [blown, setBlown] = useState(false);
  const [showWish, setShowWish] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [autoCountdown, setAutoCountdown] = useState<number | null>(null);

  const handleBlow = useCallback(() => {
    if (blown) return;
    setBlown(true);
    setAutoCountdown(null);

    setTimeout(() => setShowWish(true), 800);
    setTimeout(() => setShowResponse(true), 2500);

    // Confetti explosion
    const count = 200;
    const defaults = { origin: { y: 0.7 }, startVelocity: 30 };
    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }
    setTimeout(() => {
      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f472b6', '#a78bfa', '#fbbf24'] });
      fire(0.2, { spread: 60, colors: ['#67e8f9', '#f9a8d4', '#c4b5fd'] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ['#fbbf24', '#f472b6'] });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2, shapes: ['star'], colors: ['#a78bfa'] });
      fire(0.1, { spread: 120, startVelocity: 45, colors: ['#f472b6', '#fbbf24'] });
    }, 300);
  }, [blown]);

  // External trigger
  useEffect(() => {
    if (triggerBlow && !blown) {
      handleBlow();
    }
  }, [triggerBlow, blown, handleBlow]);

  // Auto-blow countdown when scrolled into view without clicking!
  useEffect(() => {
    if (!isInView || blown) return;

    setAutoCountdown(3);
    const interval = setInterval(() => {
      setAutoCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          handleBlow();
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isInView, blown, handleBlow]);

  return (
    <section ref={ref} id="cake" className="relative py-28 px-4 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(244,114,182,0.12), transparent)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div className="max-w-2xl mx-auto text-center relative z-10">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <p className="font-body text-xs tracking-[0.3em] uppercase mb-3" style={{ color: '#c084fc' }}>
            ✦ A Moment For Wishes ✦
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light gradient-text-cosmic">
            Make A Wish
          </h2>
          <p className="text-xs text-purple-300/80 mt-2 font-light">
            Biarkan bintang-bintang di seluruh galaksi mendengar permohonanmu
          </p>
        </motion.div>

        {/* Cake */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
          className="relative inline-block my-4"
          style={{ width: '250px', userSelect: 'none' }}
        >
          {/* Candles layer */}
          <div style={{ position: 'relative', height: '50px', marginBottom: '-4px' }}>
            {CANDLE_POSITIONS.map((c, i) => (
              <Candle key={i} x={c.x} color={c.color} blown={blown} />
            ))}
          </div>

          {/* Top tier */}
          <div
            style={{
              height: '42px',
              background: 'linear-gradient(135deg, #f9a8d4, #f472b6, #e879f9)',
              borderRadius: '8px 8px 0 0',
              border: '2px solid rgba(255,255,255,0.25)',
              boxShadow: '0 0 25px rgba(244,114,182,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '8px',
                left: '0',
                right: '0',
                borderTop: '2px dashed rgba(255,255,255,0.4)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '9px',
                color: 'white',
                fontFamily: 'Outfit',
                letterSpacing: '3px',
                fontWeight: 600,
              }}
            >
              HAPPY BIRTHDAY
            </div>
          </div>

          {/* Middle tier */}
          <div
            style={{
              height: '52px',
              background: 'linear-gradient(135deg, #c084fc, #a78bfa, #7c3aed)',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 25px rgba(167,139,250,0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  bottom: '-5px',
                  left: `${i * 22}%`,
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                fontSize: '22px',
              }}
            >
              🎂
            </div>
          </div>

          {/* Bottom tier */}
          <div
            style={{
              height: '64px',
              background: 'linear-gradient(135deg, #fde68a, #fbbf24, #f59e0b)',
              borderRadius: '0 0 14px 14px',
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: '0 0 30px rgba(251,191,36,0.6), 0 8px 25px rgba(0,0,0,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  top: '-6px',
                  left: `${i * 18}%`,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.25)',
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '10px',
                color: 'rgba(120,60,0,0.8)',
                fontFamily: 'Outfit',
                fontWeight: 700,
                whiteSpace: 'nowrap',
                letterSpacing: '2px',
              }}
            >
              ✦ MAKE A WISH ✦
            </div>
          </div>

          {/* Plate / base glow */}
          <div
            style={{
              width: '120%',
              marginLeft: '-10%',
              height: '10px',
              background: 'radial-gradient(ellipse, rgba(251,191,36,0.5), transparent)',
              filter: 'blur(5px)',
            }}
          />
        </motion.div>

        {/* Blow Status & Auto-Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8"
        >
          {!blown ? (
            <div className="flex flex-col items-center gap-3">
              {autoCountdown !== null && (
                <span className="text-xs text-amber-300 font-mono flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                  ✨ Meniup lilin otomatis dalam <strong className="text-white">{autoCountdown}s</strong>...
                </span>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleBlow}
                className="btn-primary px-10 py-3.5 text-base cursor-pointer"
              >
                Tiup Lilin Sekarang 🕯️
              </motion.button>
            </div>
          ) : (
            <AnimatePresence>
              {showWish && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="space-y-4 glass-card p-6 rounded-3xl border border-pink-500/30 max-w-lg mx-auto"
                >
                  <p className="font-script text-3xl md:text-4xl text-glow-gold" style={{ color: '#fbbf24' }}>
                    {candleMessage}
                  </p>
                  {showResponse && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="font-display italic text-lg font-light"
                      style={{ color: '#c4b5fd' }}
                    >
                      "{wishResponse}"
                    </motion.p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </section>
  );
}
