import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

interface BirthdayMessageProps {
  partnerName: string;
  message: string;
}

export default function BirthdayMessage({ message }: BirthdayMessageProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const paragraphs = message.split('\n\n').filter(p => p.trim());

  return (
    <section
      ref={ref}
      id="message"
      className="relative py-24 px-4 md:px-8 overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '10%', left: '5%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190,24,93,0.1), transparent)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '5%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.1), transparent)',
          filter: 'blur(50px)',
        }} />
      </div>

      <div className="relative max-w-3xl mx-auto">
        {/* Section title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="font-body text-sm tracking-[0.3em] mb-4" style={{ color: '#a78bfa' }}>PESAN DARI LUBUK HATI</p>
          <h2 className="font-script text-5xl md:text-7xl text-glow-pink mb-4" style={{ color: '#f9a8d4' }}>
            Selamat Ulang Tahun, Cintaku
          </h2>
          <p className="font-script text-2xl" style={{ color: '#c4b5fd' }}>❤️</p>
          <div style={{
            width: '80px', height: '1px',
            background: 'linear-gradient(90deg, transparent, #f472b6, transparent)',
            margin: '20px auto',
          }} />
        </motion.div>

        {/* Message paragraphs */}
        <div className="glass-strong rounded-3xl p-8 md:p-12" style={{ border: '1px solid rgba(167,139,250,0.15)' }}>
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
              className="font-body text-base md:text-lg leading-relaxed mb-6 last:mb-0"
              style={{
                color: i === paragraphs.length - 1 ? '#f9a8d4' : '#e2e8f0',
                fontStyle: (i === paragraphs.length - 1 || i === paragraphs.length - 2) ? 'italic' : 'normal',
                lineHeight: 1.9,
              }}
            >
              {para}
            </motion.p>
          ))}

          {/* Decorative bottom */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: paragraphs.length * 0.15 + 0.5, duration: 0.8 }}
            className="text-center mt-8 pt-8"
            style={{ borderTop: '1px solid rgba(167,139,250,0.15)' }}
          >
            <div className="flex justify-center gap-3 text-2xl mb-4">
              {['✨', '❤️', '🌌', '❤️', '✨'].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                >
                  {e}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Quote at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 1 }}
          className="text-center mt-12"
        >
          <p className="font-display italic text-xl md:text-2xl font-light" style={{ color: '#c4b5fd' }}>
            "Di antara miliaran bintang di alam semesta,
          </p>
          <p className="font-display italic text-xl md:text-2xl font-light mb-2" style={{ color: '#c4b5fd' }}>
            aku tetap memilih kamu."
          </p>
        </motion.div>
      </div>
    </section>
  );
}
