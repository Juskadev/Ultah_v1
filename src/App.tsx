import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { useBirthdayConfig } from './config/configStore';
import StarField from './components/StarField';
import CustomCursor from './components/CustomCursor';
import OpeningScreen from './components/OpeningScreen';
import OrbitSystem from './components/OrbitSystem';
import Lightbox from './components/Lightbox';
import BirthdayMessage from './components/BirthdayMessage';
import MemoryGallery from './components/MemoryGallery';
import LoveTimeline from './components/LoveTimeline';
import BirthdayCake from './components/BirthdayCake';
import MusicPlayer from './components/MusicPlayer';
import SurpriseModal from './components/SurpriseModal';
import DreamyClouds from './components/DreamyClouds';
import HappyMoments from './components/HappyMoments';
import FinalSection from './components/FinalSection';
import AdminPanel from './components/AdminPanel';
import AutoPlayController from './components/AutoPlayController';

// Easter egg: Konami code
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function App() {
  const { config, updateConfig, resetConfig } = useBirthdayConfig();

  const [hasEntered, setHasEntered] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [lightboxPhotos, setLightboxPhotos] = useState(config.galleryPhotos);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [musicAutoplay, setMusicAutoplay] = useState(false);
  const [cakeBlowTrigger, setCakeBlowTrigger] = useState(false);

  const konamiSequenceRef = useRef<string[]>([]);
  const [konamiTriggered, setKonamiTriggered] = useState(false);
  const [heartExplosion, setHeartExplosion] = useState<{ x: number; y: number }[]>([]);
  const logoClickCount = useRef(0);

  const handleEnter = useCallback(() => {
    setHasEntered(true);
    setMusicAutoplay(true);
  }, []);

  const openLightbox = useCallback((photos: typeof config.galleryPhotos, index: number) => {
    setLightboxPhotos(photos);
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  // Keyboard shortcuts: Konami & Admin (Ctrl+Shift+A)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Konami
      const next = [...konamiSequenceRef.current, e.key].slice(-KONAMI.length);
      konamiSequenceRef.current = next;
      if (next.join(',') === KONAMI.join(',') && !konamiTriggered) {
        setKonamiTriggered(true);
        setSurpriseOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [konamiTriggered]);

  // Heart explosion on logo click
  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    logoClickCount.current += 1;
    if (logoClickCount.current >= 4) {
      logoClickCount.current = 0;
      const hearts = Array.from({ length: 20 }, () => ({
        x: e.clientX + (Math.random() - 0.5) * 200,
        y: e.clientY + (Math.random() - 0.5) * 100,
      }));
      setHeartExplosion(hearts);
      setTimeout(() => setHeartExplosion([]), 2000);
    }
  }, []);

  // Update lightbox photos if config changes
  useEffect(() => {
    setLightboxPhotos(config.galleryPhotos);
  }, [config.galleryPhotos]);

  return (
    <div
      className="relative min-h-screen"
      style={{
        background: `radial-gradient(ellipse at top, ${config.bgGradientStart || '#12082a'} 0%, ${config.bgGradientEnd || '#0a0e1a'} 100%)`,
        ['--theme-primary' as any]: config.primaryColor || '#f472b6',
        ['--theme-secondary' as any]: config.secondaryColor || '#a78bfa',
        ['--theme-accent' as any]: config.accentGlowColor || '#fbbf24',
        ['--theme-bg-start' as any]: config.bgGradientStart || '#12082a',
        ['--theme-bg-end' as any]: config.bgGradientEnd || '#0a0e1a',
      }}
    >
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Fixed star and dreamy clouds background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <StarField easterEggQuotes={config.easterEggQuotes} />
        <DreamyClouds />
      </div>

      {/* =================== OPENING SCREEN (WITH AUTO-ENTER) =================== */}
      <AnimatePresence>
        {!hasEntered && (
          <OpeningScreen
            openingLine={config.openingLine}
            openingTitle={config.openingTitle}
            onEnter={handleEnter}
          />
        )}
      </AnimatePresence>

      {/* =================== HANDS-FREE AUTOPLAY CONTROLLER =================== */}
      <AutoPlayController
        hasEntered={hasEntered}
        onTriggerCakeBlow={() => setCakeBlowTrigger(true)}
        onTriggerSurprise={() => setSurpriseOpen(true)}
      />

      {/* =================== ADMIN DASHBOARD =================== */}
      <AdminPanel
        config={config}
        onSave={updateConfig}
        onReset={resetConfig}
      />

      {/* =================== MAIN CONTENT =================== */}
      <AnimatePresence>
        {hasEntered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative z-10"
          >
            {/* Header bar */}
            <header
              className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center"
              style={{ background: 'linear-gradient(180deg, rgba(10,14,26,0.85), transparent)', backdropFilter: 'blur(8px)' }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 cursor-pointer group"
                onClick={handleLogoClick}
                title="Klik untuk kejutan bintang"
              >
                <span className="text-xl group-hover:scale-125 transition-transform duration-300">✨</span>
                <span className="font-script text-2xl text-glow-pink" style={{ color: config.primaryColor || '#f9a8d4' }}>
                  Semesta Kita
                </span>
                {config.showWatermark && (
                  <span className="hidden sm:inline-block text-[10px] font-mono tracking-wider px-2 py-0.5 rounded-full bg-purple-900/40 border border-purple-500/20 text-purple-300/80">
                    {config.watermarkText || 'By Jus_Romance'}
                  </span>
                )}
              </motion.div>

              {/* Nav links */}
              <motion.nav
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="hidden md:flex items-center gap-6"
              >
                {[
                  { href: '#hero', label: 'Semesta 3D' },
                  { href: '#message', label: 'Surat Cinta' },
                  { href: '#happy', label: 'Bahagia' },
                  { href: '#gallery', label: 'Galeri' },
                  { href: '#journey', label: 'Perjalanan' },
                  { href: '#cake', label: 'Kue Ultah' },
                  { href: '#final', label: 'Selamanya' },
                ].map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="font-body text-xs tracking-widest transition-all hover:text-pink-300"
                    style={{ color: '#94a3b8', textDecoration: 'none' }}
                  >
                    {link.label.toUpperCase()}
                  </a>
                ))}
              </motion.nav>
            </header>

            {/* ===== HERO / 3D ORBIT SECTION ===== */}
            <OrbitSystem
              photos={config.orbitPhotos}
              heroTitle={config.heroTitle}
              heroSubtitle={config.heroSubtitle}
              onPhotoClick={(i) => openLightbox(config.orbitPhotos, i)}
            />

            {/* ===== BIRTHDAY MESSAGE ===== */}
            <BirthdayMessage
              partnerName={config.partnerName}
              message={config.birthdayMessage}
            />

            {/* ===== HAL-HAL YANG MEMBUAT BAHAGIA ===== */}
            <HappyMoments />

            {/* ===== MEMORY GALLERY ===== */}
            <MemoryGallery
              photos={config.galleryPhotos}
              onPhotoClick={(i) => openLightbox(config.galleryPhotos, i)}
            />

            {/* ===== LOVE TIMELINE ===== */}
            <LoveTimeline
              items={config.timeline}
              onPhotoClick={(i) => openLightbox(config.galleryPhotos, i)}
            />

            {/* ===== BIRTHDAY CAKE (WITH HANDS-FREE AUTO-BLOW) ===== */}
            <BirthdayCake
              candleMessage={config.candleMessage}
              wishResponse={config.wishResponse}
              triggerBlow={cakeBlowTrigger}
            />

            {/* ===== FINAL SECTION ===== */}
            <FinalSection
              senderName={config.senderName}
              finalMessage={config.finalMessage}
              closingWords={config.closingWords}
              partnerName={config.partnerName}
              watermarkText={config.watermarkText}
              showWatermark={config.showWatermark}
              sellerContact={config.sellerContact}
            />

            {/* ===== FLOATING MUSIC PLAYER ===== */}
            <MusicPlayer
              musicSrc={config.music}
              title={config.musicTitle}
              autoplay={musicAutoplay}
            />

            {/* ===== SURPRISE BUTTON ===== */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSurpriseOpen(true)}
              className="fixed bottom-24 right-6 z-40 btn-cosmic px-5 py-3 text-xs tracking-wider"
              style={{
                color: '#fbbf24',
                border: '1px solid rgba(251,191,36,0.4)',
                background: 'rgba(18,8,42,0.85)',
                backdropFilter: 'blur(12px)',
              }}
            >
              ✨ Rahasia Untukmu
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxOpen && (
          <Lightbox
            photos={lightboxPhotos}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ===== SURPRISE MODAL ===== */}
      <AnimatePresence>
        {surpriseOpen && (
          <SurpriseModal onClose={() => setSurpriseOpen(false)} />
        )}
      </AnimatePresence>

      {/* ===== HEART EXPLOSION (logo easter egg) ===== */}
      {heartExplosion.map((h, i) => (
        <motion.div
          key={i}
          className="heart-particle pointer-events-none fixed z-[9999]"
          style={{ left: h.x, top: h.y, fontSize: `${Math.random() * 16 + 14}px` }}
          initial={{ opacity: 1, scale: 0 }}
          animate={{ opacity: 0, scale: 1.2, y: -90 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          {['❤️', '💖', '💫', '✨', '🪐'][Math.floor(Math.random() * 5)]}
        </motion.div>
      ))}
    </div>
  );
}
