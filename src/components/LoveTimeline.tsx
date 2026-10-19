import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  image: string;
  emoji: string;
}

interface LoveTimelineProps {
  items: TimelineItem[];
  onPhotoClick?: (index: number) => void;
}

function TimelineCard({ item, isLeft, onPhotoClick }: {
  item: TimelineItem;
  isLeft: boolean;
  onPhotoClick?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.1 }}
      className={`flex items-center gap-4 md:gap-8 ${isLeft ? 'flex-row' : 'flex-row-reverse'} mb-12`}
    >
      {/* Content card */}
      <div className={`flex-1 ${isLeft ? 'text-right' : 'text-left'}`}>
        <div className="glass-strong rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300"
          style={{ border: '1px solid rgba(167,139,250,0.1)' }}
        >
          <p className="font-body text-xs tracking-widest mb-2" style={{ color: '#a78bfa' }}>
            {item.date}
          </p>
          <h3 className="font-display text-xl md:text-2xl font-light mb-3 gradient-text-cosmic">
            {item.title}
          </h3>
          <p className="font-body text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
            {item.description}
          </p>

          {/* Photo thumbnail */}
          <div
            className="mt-4 cursor-pointer overflow-hidden rounded-xl transition-all duration-300 hover:opacity-80"
            style={{ height: '120px', background: '#1a0a2e' }}
            onClick={onPhotoClick}
          >
            {imgError ? (
              <div
                style={{
                  width: '100%', height: '100%',
                  background: 'radial-gradient(circle, rgba(167,139,250,0.2), #12082a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '30px',
                }}
              >
                {item.emoji}
              </div>
            ) : (
              <img
                src={item.image}
                alt={item.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={() => setImgError(true)}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dot */}
      <div className="timeline-dot flex-shrink-0">
        <span style={{ fontSize: '20px' }}>{item.emoji}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1 hidden md:block" />
    </motion.div>
  );
}

export default function LoveTimeline({ items, onPhotoClick }: LoveTimelineProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section id="journey" className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent, rgba(18,8,42,0.5), transparent)',
        }} />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            className="font-body text-sm tracking-[0.3em] mb-4"
            style={{ color: '#a78bfa' }}
          >
            MENEMBUS RUANG DAN WAKTU
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="section-title gradient-text-gold"
          >
            Kisah Perjalanan Kita ✨
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{
              width: '80px', height: '1px',
              background: 'linear-gradient(90deg, transparent, #fbbf24, transparent)',
              margin: '20px auto',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
            className="font-body text-sm"
            style={{ color: '#94a3b8' }}
          >
            Setiap babak dalam kisah cinta kita yang terukir di bintang-bintang
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Center line */}
          <div
            className="absolute left-1/2 top-0 bottom-0 w-px hidden md:block"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(167,139,250,0.4), rgba(244,114,182,0.4), transparent)', transform: 'translateX(-50%)' }}
          />
          {/* Mobile left line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px md:hidden"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(167,139,250,0.4), transparent)' }}
          />

          {items.map((item, i) => (
            <TimelineCard
              key={i}
              item={item}
              isLeft={i % 2 === 0}
              onPhotoClick={() => onPhotoClick?.(Math.min(i, 5))}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
