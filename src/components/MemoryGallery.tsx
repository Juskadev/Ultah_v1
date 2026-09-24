import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';

interface Photo {
  src: string;
  caption: string;
}

interface MemoryGalleryProps {
  photos: Photo[];
  onPhotoClick: (index: number) => void;
}

const ROTATIONS = [-3, 2, -1.5, 3, -2, 1, -3.5, 2.5];

function PolaroidCard({ photo, index, onClick }: { photo: Photo; index: number; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const rotation = ROTATIONS[index % ROTATIONS.length];
  const PLACEHOLDER_COLORS = ['#a78bfa', '#f472b6', '#67e8f9', '#fbbf24', '#c084fc', '#34d399', '#fb923c', '#60a5fa'];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, rotate: rotation - 5 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotate: hovered ? 0 : rotation,
        scale: hovered ? 1.06 : 1,
      } : {}}
      transition={{
        delay: index * 0.1,
        duration: 0.6,
        type: 'spring',
        stiffness: 200,
      }}
      className="polaroid cursor-pointer"
      style={{ transformOrigin: 'center bottom' }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="overflow-hidden rounded-sm"
        style={{ width: '100%', aspectRatio: '4/3', background: '#1a0a2e' }}
      >
        {imgError ? (
          <div
            style={{
              width: '100%', height: '100%',
              background: `radial-gradient(circle at 40% 40%, ${PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length]}40, #12082a)`,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', gap: '8px',
            }}
          >
            <span>📷</span>
            <span style={{ fontSize: '11px', color: '#a78bfa', fontFamily: 'Outfit', opacity: 0.7 }}>
              photo{index + 1}.jpg
            </span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={`Memory ${index + 1}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Caption area */}
      <div className="pt-3 pb-1 px-1 text-center" style={{ minHeight: '44px' }}>
        <AnimatePresence>
          {hovered ? (
            <motion.p
              key="caption"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              className="font-body text-xs leading-relaxed"
              style={{ color: '#c4b5fd', fontStyle: 'italic' }}
            >
              {photo.caption}
            </motion.p>
          ) : (
            <motion.p
              key="number"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="font-body text-xs"
              style={{ color: '#a78bfa' }}
            >
              ♡ {String(index + 1).padStart(2, '0')}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function MemoryGallery({ photos, onPhotoClick }: MemoryGalleryProps) {
  const titleRef = useRef<HTMLDivElement>(null);
  const isTitleInView = useInView(titleRef, { once: true });

  return (
    <section id="gallery" className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: '250px', height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(167,139,250,0.08), transparent)',
          filter: 'blur(40px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: '300px', height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(244,114,182,0.08), transparent)',
          filter: 'blur(40px)',
        }} />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Title */}
        <div ref={titleRef} className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-sm tracking-[0.3em] mb-4"
            style={{ color: '#a78bfa' }}
          >
            CHERISHED MEMORIES
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isTitleInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="section-title gradient-text-pink"
          >
            Our Little Universe
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isTitleInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            style={{
              width: '80px', height: '1px',
              background: 'linear-gradient(90deg, transparent, #f472b6, transparent)',
              margin: '20px auto',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isTitleInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-body text-sm font-light"
            style={{ color: '#94a3b8' }}
          >
            A collection of moments that made our universe shine brighter
          </motion.p>
        </div>

        {/* Gallery Grid */}
        <div
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          }}
        >
          {photos.map((photo, i) => (
            <PolaroidCard
              key={i}
              photo={photo}
              index={i}
              onClick={() => onPhotoClick(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
