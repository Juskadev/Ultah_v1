import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Heart,
  Sparkles,
  Award,
  Gift,
  Lock,
  Unlock,
  CheckCircle,
  Copy,
  Check,
  Star,
  Shield,
  Coffee,
  Crown,
  X,
  Scroll,
} from 'lucide-react';

interface PhotoItem {
  src: string;
  caption?: string;
}

interface SurpriseModalProps {
  onClose: () => void;
  partnerName?: string;
  senderName?: string;
  photos?: PhotoItem[];
}

export default function SurpriseModal({
  onClose,
  partnerName = 'Mutia Fajriah',
  senderName = 'Aku',
  photos = [],
}: SurpriseModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'promises' | 'coupons' | 'certificate'>('letter');
  const [claimedCoupons, setClaimedCoupons] = useState<number[]>([]);
  const [copiedCert, setCopiedCert] = useState(false);
  const [unlockedPromises, setUnlockedPromises] = useState<number[]>([0]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  // Fallback photo list if empty
  const photoList = photos.length > 0 ? photos : [
    { src: './photos/photo1.jpg', caption: 'Kenangan terindah' },
    { src: './photos/photo2.jpg', caption: 'Momen manis' },
    { src: './photos/photo3.jpg', caption: 'Arti kebahagiaan' },
    { src: './photos/photo4.jpg', caption: 'Terukir abadi' },
    { src: './photos/photo5.jpg', caption: 'Tertawa bersamamu' },
    { src: './photos/photo6.jpg', caption: 'Duniaku bercahaya' },
    { src: './photos/photo7.jpg', caption: 'Bidadari semesta' },
    { src: './photos/photo8.jpg', caption: 'Tingkah manjamu' },
  ];

  // Key portraits
  const heroPhoto = photoList[6]?.src || photoList[0]?.src || './photos/photo7.jpg';
  const couplePhoto = photoList[0]?.src || './photos/photo1.jpg';

  // Confetti helper
  const triggerConfetti = useCallback((originX = 0.5, originY = 0.5) => {
    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: originX, y: originY },
      colors: ['#ff4d8d', '#c2185b', '#fda4af', '#fbbf24', '#ffffff'],
      shapes: ['star', 'circle'],
      scalar: 1.2,
    });
  }, []);

  // Unlock sequence
  const handleUnlock = () => {
    setIsUnlocked(true);
    triggerConfetti(0.5, 0.4);
    setTimeout(() => triggerConfetti(0.3, 0.5), 250);
    setTimeout(() => triggerConfetti(0.7, 0.5), 500);
  };

  // Claim coupon
  const handleClaimCoupon = (idx: number, e: React.MouseEvent) => {
    if (claimedCoupons.includes(idx)) return;
    setClaimedCoupons((prev) => [...prev, idx]);
    const rect = e.currentTarget.getBoundingClientRect();
    triggerConfetti(rect.left / window.innerWidth, rect.top / window.innerHeight);
  };

  // Toggle promise
  const handleUnlockPromise = (idx: number, e: React.MouseEvent) => {
    if (!unlockedPromises.includes(idx)) {
      setUnlockedPromises((prev) => [...prev, idx]);
      const rect = e.currentTarget.getBoundingClientRect();
      triggerConfetti(rect.left / window.innerWidth, rect.top / window.innerHeight);
    }
  };

  // Copy certificate
  const handleCopyCertificate = () => {
    const text = `📜 SERTIFIKAT RESMI CINTA SEMESTA 📜\n\nDiberikan kepada: ${partnerName}\nDari: ${senderName}\nStatus: Pemilik Tunggal Seluruh Cinta & Kesetiaan di Galaksi Ini ❤️\nKode Verifikasi: COSMIC-REG-MUTIA-2026-FOREVER\nBerlaku: Selamanya & Abadi ✨`;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCert(true);
      triggerConfetti();
      setTimeout(() => setCopiedCert(false), 3000);
    });
  };

  const promises = [
    {
      title: 'Menjadi Tempatmu Pulang',
      icon: Heart,
      desc: 'Dalam keadaan apa pun, kamu akan selalu memiliki tempat ternyaman dan terhangat untuk bercerita dan bersandar — yaitu di pelukanku.',
      color: '#ff4d8d',
      photo: photoList[0]?.src || './photos/photo1.jpg',
    },
    {
      title: 'Menjaga dan Menggenggam Erat',
      icon: Shield,
      desc: 'Aku berjanji akan selalu ada di sampingmu, melewati hari-hari yang menyenangkan maupun saat dunia terasa begitu melelahkan.',
      color: '#c2185b',
      photo: photoList[1]?.src || './photos/photo2.jpg',
    },
    {
      title: 'Menjaga Senyum & Kebahagiaanmu',
      icon: Star,
      desc: 'Melihat senyum manis dan mendengar tawamu adalah salah satu prioritas terindah dalam hidupku yang tak akan pernah berubah.',
      color: '#fbbf24',
      photo: photoList[5]?.src || './photos/photo6.jpg',
    },
    {
      title: 'Mendukung Segala Impianmu',
      icon: Sparkles,
      desc: 'Aku akan selalu menjadi orang pertama yang bertepuk tangan paling kencang dan mendoakan setiap langkah cita-citamu.',
      color: '#38bdf8',
      photo: photoList[6]?.src || './photos/photo7.jpg',
    },
    {
      title: 'Kesetiaan yang Abadi',
      icon: Crown,
      desc: 'Di antara miliaran jiwa dan bintang di alam semesta, hanya hatimu yang kupilih dan akan selalu kupilih berulang kali.',
      color: '#a78bfa',
      photo: photoList[7]?.src || './photos/photo8.jpg',
    },
  ];

  const coupons = [
    {
      title: 'Kencan Spesial & Makan Sepuasnya',
      icon: Coffee,
      desc: 'Bebas tentukan kafe atau restoran favoritmu kapan saja. Semua pesanan dan waktu sepenuhnya untukmu!',
      badge: 'Bisa Diklaim Kapan Saja',
      color: '#ff4d8d',
      photo: photoList[5]?.src || './photos/photo6.jpg',
    },
    {
      title: 'Pelukan Hangat Tanpa Syarat',
      icon: Heart,
      desc: 'Berlaku saat kamu capek, sedih, atau cuma butuh ketenangan. Pelukan hangat siap menyambutmu 24/7.',
      badge: 'Masa Berlaku: Selamanya',
      color: '#c2185b',
      photo: photoList[0]?.src || './photos/photo1.jpg',
    },
    {
      title: 'Jalan Santai & Quality Time Berdua',
      icon: Sparkles,
      desc: 'Menikmati sore santai, mengobrol berjam-jam, atau jalan-jalan tanpa memikirkan beban pekerjaan.',
      badge: 'Bebas Pilih Hari',
      color: '#fbbf24',
      photo: photoList[3]?.src || './photos/photo4.jpg',
    },
    {
      title: 'Kupon Ratu Sehari (Queen of The Day)',
      icon: Crown,
      desc: 'Satu hari penuh di mana semua keinginanmu akan selalu kuusahakan dan kuwujudkan dengan senyuman!',
      badge: 'Super Eksklusif',
      color: '#a78bfa',
      photo: photoList[6]?.src || './photos/photo7.jpg',
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      style={{
        background: 'rgba(26, 4, 16, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background starlight glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 77, 141, 0.2) 0%, rgba(194, 24, 91, 0.12) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[100001] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xl"
        style={{
          background: 'rgba(61, 10, 37, 0.85)',
          border: '1px solid rgba(255, 77, 141, 0.4)',
          color: '#fda4af',
        }}
        title="Tutup Rahasia"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Main Container Card */}
      <div className="relative z-10 w-full max-w-2xl my-auto">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            /* ================= STATE 1: MYSTERY COSMIC VAULT WITH GLOWING PORTRAIT ================= */
            <motion.div
              key="locked-vault"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center p-6 sm:p-12 rounded-3xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 10, 37, 0.92), rgba(26, 4, 16, 0.96))',
                border: '1px solid rgba(255, 77, 141, 0.35)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(255, 77, 141, 0.25)',
              }}
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-5 text-[11px] font-mono tracking-widest uppercase"
                style={{
                  background: 'rgba(255, 77, 141, 0.15)',
                  border: '1px solid rgba(255, 77, 141, 0.4)',
                  color: '#fda4af',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
                <span>KAPSUL RAHASIA RESMI SEMESTA</span>
              </motion.div>

              <h2 className="font-display text-2xl sm:text-4xl text-white font-normal mb-2">
                Sebuah Rahasia Tersembunyi Khusus Untuk{' '}
                <span className="font-script text-3xl sm:text-5xl gradient-text-pink block sm:inline mt-1">
                  {partnerName} ❤️
                </span>
              </h2>

              <p className="font-body text-xs sm:text-sm text-pink-200/80 max-w-md mx-auto mb-8 leading-relaxed font-light">
                Terkunci di kedalaman orbit cinta terkuat di galaksi. Sentuh foto bercahayamu di bawah ini untuk membukanya...
              </p>

              {/* Pulsing Hologram Lock with Mutia's Glowing Photo */}
              <div className="relative w-44 h-44 mx-auto mb-8 flex items-center justify-center">
                {/* Outer orbital rings */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px dashed rgba(255, 77, 141, 0.6)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{
                    border: '1px solid rgba(251, 191, 36, 0.5)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
                />

                {/* Mutia's Glowing Portrait Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={handleUnlock}
                  className="w-32 h-32 rounded-full relative z-10 cursor-pointer overflow-hidden p-1 transition-shadow"
                  style={{
                    background: 'linear-gradient(135deg, #ff4d8d, #fbbf24)',
                    boxShadow: '0 0 35px rgba(255, 77, 141, 0.7), 0 0 15px rgba(251, 191, 36, 0.5)',
                  }}
                >
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={heroPhoto}
                      alt={partnerName}
                      className="w-full h-full object-cover"
                    />
                    {/* Glowing lock badge overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col items-center justify-end pb-2">
                      <div className="w-7 h-7 rounded-full bg-pink-600/90 border border-white/60 flex items-center justify-center shadow-lg">
                        <Lock className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className="text-[9px] font-mono font-bold tracking-wider text-white uppercase mt-0.5">
                        Sentuh
                      </span>
                    </div>
                  </div>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlock}
                className="btn-cosmic px-8 py-3 text-xs sm:text-sm tracking-wider font-medium cursor-pointer inline-flex items-center gap-2 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.35), rgba(194, 24, 91, 0.35))',
                  border: '1px solid rgba(255, 77, 141, 0.55)',
                  color: '#fda4af',
                }}
              >
                <Unlock className="w-4 h-4 text-pink-300" />
                <span>Buka Rahasia Spesial Ini ✨</span>
              </motion.button>
            </motion.div>
          ) : (
            /* ================= STATE 2: THE SECRET SANCTUM WITH PHOTOS ================= */
            <motion.div
              key="unlocked-sanctum"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-4 sm:p-7 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 10, 37, 0.96), rgba(26, 4, 16, 0.98))',
                border: '1px solid rgba(255, 77, 141, 0.4)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 77, 141, 0.25)',
              }}
            >
              {/* Header Title */}
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-pink-300 mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>KAPSUL RAHASIA BERHASIL DIBUKA</span>
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-white">
                  Rahasia Terindah Untuk{' '}
                  <span className="font-script text-3xl sm:text-4xl text-glow-pink" style={{ color: '#ff70a6' }}>
                    {partnerName}
                  </span>
                </h3>
              </div>

              {/* Photo Memory Mini Strip (Horizontal scrollable polaroids) */}
              <div className="mb-5 pb-1 overflow-x-auto no-scrollbar flex items-center gap-2.5 px-1">
                {photoList.map((photo, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.08, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedPhotoIndex(i)}
                    className="flex-shrink-0 cursor-pointer p-1 rounded-xl bg-white/10 border border-pink-400/30 shadow-md transition-all"
                    style={{
                      transform: i % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)',
                      background: 'rgba(48, 8, 30, 0.85)',
                    }}
                  >
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden">
                      <img
                        src={photo.src}
                        alt={`Kenangan ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Navigation Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5 p-1.5 rounded-2xl bg-black/40 border border-pink-500/20">
                {[
                  { id: 'letter', label: 'Surat Rahasia', icon: Scroll },
                  { id: 'promises', label: '5 Janji Cinta', icon: Shield },
                  { id: 'coupons', label: 'Kupon Hadiah', icon: Gift },
                  { id: 'certificate', label: 'Sertifikat', icon: Award },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-300"
                      style={{
                        background: isActive
                          ? 'linear-gradient(135deg, rgba(255, 77, 141, 0.4), rgba(194, 24, 91, 0.4))'
                          : 'transparent',
                        border: isActive ? '1px solid rgba(255, 77, 141, 0.5)' : '1px solid transparent',
                        color: isActive ? '#ffffff' : '#fda4af',
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" style={{ color: isActive ? '#fbbf24' : '#fda4af' }} />
                      <span className="truncate">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Contents */}
              <div className="min-h-[310px] max-h-[55vh] overflow-y-auto pr-1">
                {/* TAB 1: SURAT RAHASIA WITH POLAROID PHOTO */}
                {activeTab === 'letter' && (
                  <motion.div
                    key="tab-letter"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-7 rounded-2xl relative"
                    style={{
                      background: 'rgba(38, 6, 23, 0.75)',
                      border: '1px solid rgba(255, 77, 141, 0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-pink-500/20 pb-3 mb-4 text-xs font-mono text-pink-300">
                      <span>KEPADA: {partnerName.toUpperCase()}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-900/40 border border-pink-500/30">
                        TERSEGEL ABADI ⚜️
                      </span>
                    </div>

                    {/* Featured Polaroid Photo Cards in Letter */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-5 p-3 rounded-xl bg-black/30 border border-pink-500/20">
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-1 bg-white shadow-xl"
                          style={{ transform: 'rotate(-3deg)' }}
                        >
                          <div className="w-full h-full rounded-lg overflow-hidden">
                            <img
                              src={heroPhoto}
                              alt={partnerName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                        <div
                          className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl p-1 bg-white shadow-xl"
                          style={{ transform: 'rotate(3deg)' }}
                        >
                          <div className="w-full h-full rounded-lg overflow-hidden">
                            <img
                              src={couplePhoto}
                              alt="Kita berdua"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-script text-2xl text-pink-300 mb-1">
                          Bidadari Paling Indah di Semestaku...
                        </p>
                        <p className="font-body text-xs text-pink-200/80 leading-relaxed font-light">
                          Wajah cantik dan senyum teduh ini adalah alasan mengapa hariku selalu dipenuhi dengan rasa syukur dan kebahagiaan yang tak terhingga.
                        </p>
                      </div>
                    </div>

                    <div className="font-body text-xs sm:text-sm text-pink-100/90 leading-relaxed space-y-3.5 font-light">
                      <p>
                        Jika ada satu hal yang paling ingin kukatakan padamu di hari istimewa ini, itu adalah betapa bersyukurnya aku karena semesta mempertemukanku denganmu.
                      </p>
                      <p>
                        Di antara miliaran orang di dunia, kamu adalah satu-satunya yang mampu membuat duniaku terasa jauh lebih damai, lebih bermakna, dan penuh dengan warna-warna bahagia. Senyummu adalah alasan terbaik bagiku untuk selalu bersemangat menyambut hari esok.
                      </p>
                      <p>
                        Terima kasih sudah menjadi sosok yang begitu luar biasa, penuh kehangatan, dan selalu mengerti diriku. Selamat ulang tahun, cintaku. Semoga segala kebaikan, kesehatan, dan kebahagiaan paling tulus selalu menyertai setiap langkahmu.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between text-xs">
                      <span className="text-pink-300/80 font-script text-2xl">Dengan segenap cintaku,</span>
                      <span className="font-display text-white font-medium tracking-wider">{senderName} ❤️</span>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: 5 JANJI CINTA WITH MINI PHOTO THUMBNAILS */}
                {activeTab === 'promises' && (
                  <motion.div
                    key="tab-promises"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <p className="text-[11px] font-mono text-pink-300/80 text-center mb-2">
                      ✦ Sentuh kartu janji untuk membuka komitmen cintaku kepadamu ✦
                    </p>

                    {promises.map((p, idx) => {
                      const Icon = p.icon;
                      const isOpen = unlockedPromises.includes(idx);
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.01 }}
                          onClick={(e) => handleUnlockPromise(idx, e)}
                          className="p-3.5 rounded-2xl cursor-pointer transition-all duration-300"
                          style={{
                            background: isOpen ? 'rgba(48, 8, 30, 0.85)' : 'rgba(25, 4, 16, 0.6)',
                            border: isOpen
                              ? `1px solid ${p.color}60`
                              : '1px solid rgba(255, 255, 255, 0.08)',
                            boxShadow: isOpen ? `0 4px 20px ${p.color}25` : 'none',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {/* Photo thumbnail */}
                              <div className="w-10 h-10 rounded-xl overflow-hidden border border-pink-400/40 flex-shrink-0 shadow-md">
                                <img
                                  src={p.photo}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-display text-sm sm:text-base font-medium text-white flex items-center gap-1.5">
                                  <Icon className="w-3.5 h-3.5" style={{ color: p.color }} />
                                  <span>{idx + 1}. {p.title}</span>
                                </h4>
                              </div>
                            </div>
                            <span className="text-xs text-pink-300/80 font-mono">
                              {isOpen ? 'Terbuka ✨' : 'Sentuh 🔒'}
                            </span>
                          </div>

                          {isOpen && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-2.5 pl-13 font-body text-xs text-pink-100/85 leading-relaxed font-light"
                            >
                              "{p.desc}"
                            </motion.p>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {/* TAB 3: KUPON CINTA WITH PHOTOS */}
                {activeTab === 'coupons' && (
                  <motion.div
                    key="tab-coupons"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    {coupons.map((c, idx) => {
                      const Icon = c.icon;
                      const isClaimed = claimedCoupons.includes(idx);
                      return (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                          style={{
                            background: isClaimed
                              ? 'linear-gradient(135deg, rgba(61, 10, 37, 0.92), rgba(30, 4, 18, 0.92))'
                              : 'linear-gradient(135deg, rgba(45, 8, 28, 0.75), rgba(20, 3, 12, 0.85))',
                            border: isClaimed
                              ? '1px solid rgba(251, 191, 36, 0.5)'
                              : '1px solid rgba(255, 77, 141, 0.25)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2.5">
                              <span
                                className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                                style={{
                                  background: `${c.color}25`,
                                  border: `1px solid ${c.color}50`,
                                  color: c.color,
                                }}
                              >
                                {c.badge}
                              </span>
                              <Icon className="w-4 h-4" style={{ color: c.color }} />
                            </div>

                            <div className="flex items-start gap-2.5 mb-2">
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-pink-400/40 flex-shrink-0 shadow-md">
                                <img
                                  src={c.photo}
                                  alt={c.title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h4 className="font-display text-sm sm:text-base font-medium text-white leading-snug">
                                {c.title}
                              </h4>
                            </div>

                            <p className="font-body text-[11px] text-pink-200/75 leading-relaxed font-light mb-3">
                              {c.desc}
                            </p>
                          </div>

                          <button
                            onClick={(e) => handleClaimCoupon(idx, e)}
                            className="w-full py-2 px-3 rounded-xl text-xs font-medium cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-1.5"
                            style={{
                              background: isClaimed
                                ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))'
                                : 'linear-gradient(135deg, #ff4d8d, #be123c)',
                              border: isClaimed ? '1px solid #fbbf24' : 'none',
                              color: isClaimed ? '#fde68a' : '#ffffff',
                            }}
                          >
                            {isClaimed ? (
                              <>
                                <CheckCircle className="w-3.5 h-3.5 text-amber-300" />
                                <span>TERKLAIM / VALID SELAMANYA ❤️</span>
                              </>
                            ) : (
                              <>
                                <Gift className="w-3.5 h-3.5 text-white" />
                                <span>Klaim Kupon Hadiah Ini ✨</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* TAB 4: SERTIFIKAT CINTA RESMI WITH ROYAL PORTRAIT */}
                {activeTab === 'certificate' && (
                  <motion.div
                    key="tab-cert"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-7 rounded-3xl relative overflow-hidden text-center"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(61, 10, 37, 0.95), rgba(20, 3, 12, 0.98))',
                      border: '2px solid rgba(251, 191, 36, 0.65)',
                      boxShadow: '0 0 35px rgba(251, 191, 36, 0.2)',
                    }}
                  >
                    {/* Inner certificate border decoration */}
                    <div
                      className="absolute inset-2 rounded-2xl pointer-events-none"
                      style={{ border: '1px dashed rgba(251, 191, 36, 0.4)' }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-amber-300" />
                        <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase font-semibold">
                          OFFICIAL COSMIC CERTIFICATE
                        </span>
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>

                      <h3 className="font-display text-lg sm:text-2xl font-light text-white mb-3">
                        SERTIFIKAT KEPEMILIKAN BINTANG CINTA
                      </h3>

                      {/* Official Gold-Framed Portrait of Mutia on the Certificate */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-3 rounded-full p-1 bg-gradient-to-tr from-amber-400 via-pink-400 to-amber-200 shadow-xl">
                        <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/80">
                          <img
                            src={heroPhoto}
                            alt={partnerName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <p className="font-body text-[11px] text-pink-200/80 mb-1 font-light">
                        Diberikan secara sah dan abadi kepada:
                      </p>

                      <div className="my-2">
                        <span className="font-script text-3xl sm:text-5xl text-glow-pink gradient-text-pink block">
                          {partnerName}
                        </span>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-2" />
                      </div>

                      <p className="font-body text-xs sm:text-sm text-pink-100/90 max-w-md mx-auto leading-relaxed font-light mb-4">
                        Bahwa kamu adalah pemilik tunggal dan sah dari seluruh cinta, kesetiaan, dan doa terbaik di alam semesta ini. Berlaku dari detik ini hingga waktu tak lagi berputar.
                      </p>

                      <div className="grid grid-cols-2 gap-3 border-t border-b border-amber-300/25 py-2.5 my-3 text-xs font-mono">
                        <div>
                          <span className="text-pink-400/80 block text-[9px]">PEMBERI SERTIFIKAT</span>
                          <span className="text-white font-medium">{senderName} ❤️</span>
                        </div>
                        <div>
                          <span className="text-pink-400/80 block text-[9px]">KODE REGISTRASI</span>
                          <span className="text-amber-300 font-medium">COSMIC-REG-MUTIA-2026</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCopyCertificate}
                        className="btn-cosmic px-6 py-2.5 text-xs font-medium cursor-pointer inline-flex items-center gap-2 shadow-lg mt-1"
                        style={{
                          background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3), rgba(245, 158, 11, 0.3))',
                          border: '1px solid rgba(251, 191, 36, 0.6)',
                          color: '#fef08a',
                        }}
                      >
                        {copiedCert ? (
                          <>
                            <Check className="w-4 h-4 text-emerald-400" />
                            <span>Teks Sertifikat Berhasil Disalin! ✨</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-amber-300" />
                            <span>Salin Sertifikat Untuk Story Instagram</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-4 pt-3 border-t border-pink-500/20 flex items-center justify-between">
                <span className="text-[11px] font-script text-pink-300 text-lg sm:text-xl">
                  Selamanya bersamamu, {partnerName} ❤️
                </span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl text-xs font-medium cursor-pointer transition-colors"
                  style={{
                    background: 'rgba(255, 77, 141, 0.15)',
                    border: '1px solid rgba(255, 77, 141, 0.3)',
                    color: '#fda4af',
                  }}
                >
                  Tutup Rahasia
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Expanded photo lightbox if user taps any photo in the strip */}
      <AnimatePresence>
        {selectedPhotoIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhotoIndex(null)}
            className="fixed inset-0 z-[100005] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="max-w-md w-full p-2 bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden mb-3">
                <img
                  src={photoList[selectedPhotoIndex]?.src}
                  alt={photoList[selectedPhotoIndex]?.caption || partnerName}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-script text-2xl text-center text-pink-600 mb-1">
                {partnerName} ❤️
              </p>
              <p className="font-body text-xs text-center text-gray-600 mb-3 px-2">
                "{photoList[selectedPhotoIndex]?.caption || 'Bidadari paling mempesona di semestaku.'}"
              </p>
              <button
                onClick={() => setSelectedPhotoIndex(null)}
                className="w-full py-2 rounded-xl text-xs font-medium bg-pink-500 text-white cursor-pointer hover:bg-pink-600 transition-colors"
              >
                Kembali ke Rahasia ✨
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
