import { motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Photo {
  src: string;
  caption: string;
}

interface LightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ photos, initialIndex, onClose }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [currentIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [currentIndex]);

  const prev = () => setCurrentIndex(i => (i - 1 + photos.length) % photos.length);
  const next = () => setCurrentIndex(i => (i + 1) % photos.length);

  const photo = photos[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="lightbox-overlay"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-50 glass-strong rounded-full p-3 transition-all hover:bg-white/10"
        style={{ color: '#a78bfa' }}
      >
        <X size={20} />
      </button>

      {/* Navigation */}
      <button
        onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-4 md:left-8 z-50 glass-strong rounded-full p-3 transition-all hover:bg-white/10"
        style={{ color: '#a78bfa' }}
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-4 md:right-8 z-50 glass-strong rounded-full p-3 transition-all hover:bg-white/10"
        style={{ color: '#a78bfa' }}
      >
        <ChevronRight size={24} />
      </button>

      {/* Image */}
      <motion.div
        key={currentIndex}
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: -20 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative flex flex-col items-center gap-6 px-16 max-w-3xl w-full"
        onClick={e => e.stopPropagation()}
      >
        {/* Image or placeholder */}
        <div
          className="rounded-2xl overflow-hidden glow-purple"
          style={{ maxWidth: '70vw', maxHeight: '60vh', aspectRatio: '4/3' }}
        >
          {imgError ? (
            <div
              style={{
                width: '100%', height: '100%', minWidth: '300px', minHeight: '220px',
                background: 'radial-gradient(circle, #a78bfa30, #12082a)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                fontSize: '60px', gap: '16px',
              }}
            >
              <span>📷</span>
              <span style={{ fontSize: '14px', color: '#a78bfa', fontFamily: 'Outfit' }}>Foto {currentIndex + 1}</span>
            </div>
          ) : (
            <img
              src={photo.src}
              alt={`Kenangan ${currentIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', maxHeight: '60vh' }}
              onError={() => setImgError(true)}
            />
          )}
        </div>

        {/* Caption */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center glass rounded-2xl px-8 py-4 max-w-lg"
        >
          <p className="font-display italic text-lg font-light" style={{ color: '#e9d5ff', lineHeight: 1.7 }}>
            "{photo.caption}"
          </p>
          <p className="mt-2 text-xs font-body" style={{ color: '#7c3aed' }}>
            {currentIndex + 1} / {photos.length}
          </p>
        </motion.div>
      </motion.div>

      {/* Dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
            style={{
              width: i === currentIndex ? '20px' : '6px',
              height: '6px',
              borderRadius: '999px',
              background: i === currentIndex ? '#a78bfa' : 'rgba(167,139,250,0.3)',
              transition: 'all 0.3s ease',
              border: 'none',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
