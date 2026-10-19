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

interface SurpriseModalProps {
  onClose: () => void;
  partnerName?: string;
  senderName?: string;
}

export default function SurpriseModal({
  onClose,
  partnerName = 'Mutia Fajriah',
  senderName = 'Aku',
}: SurpriseModalProps) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<'letter' | 'promises' | 'coupons' | 'certificate'>('letter');
  const [claimedCoupons, setClaimedCoupons] = useState<number[]>([]);
  const [copiedCert, setCopiedCert] = useState(false);
  const [unlockedPromises, setUnlockedPromises] = useState<number[]>([0]);

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
    },
    {
      title: 'Menjaga dan Menggenggam Erat',
      icon: Shield,
      desc: 'Aku berjanji akan selalu ada di sampingmu, melewati hari-hari yang menyenangkan maupun saat dunia terasa begitu melelahkan.',
      color: '#c2185b',
    },
    {
      title: 'Menjaga Senyum & Kebahagiaanmu',
      icon: Star,
      desc: 'Melihat senyum manis dan mendengar tawamu adalah salah satu prioritas terindah dalam hidupku yang tak akan pernah berubah.',
      color: '#fbbf24',
    },
    {
      title: 'Mendukung Segala Impianmu',
      icon: Sparkles,
      desc: 'Aku akan selalu menjadi orang pertama yang bertepuk tangan paling kencang dan mendoakan setiap langkah cita-citamu.',
      color: '#38bdf8',
    },
    {
      title: 'Kesetiaan yang Abadi',
      icon: Crown,
      desc: 'Di antara miliaran jiwa dan bintang di alam semesta, hanya hatimu yang kupilih dan akan selalu kupilih berulang kali.',
      color: '#a78bfa',
    },
  ];

  const coupons = [
    {
      title: 'Kencan Spesial & Makan Sepuasnya',
      icon: Coffee,
      desc: 'Bebas tentukan kafe atau restoran favoritmu kapan saja. Semua pesanan dan waktu sepenuhnya untukmu!',
      badge: 'Bisa Diklaim Kapan Saja',
      color: '#ff4d8d',
    },
    {
      title: 'Pelukan Hangat Tanpa Syarat',
      icon: Heart,
      desc: 'Berlaku saat kamu capek, sedih, atau cuma butuh ketenangan. Pelukan hangat siap menyambutmu 24/7.',
      badge: 'Masa Berlaku: Selamanya',
      color: '#c2185b',
    },
    {
      title: 'Jalan Santai & Quality Time Berdua',
      icon: Sparkles,
      desc: 'Menikmati sore santai, mengobrol berjam-jam, atau jalan-jalan tanpa memikirkan beban pekerjaan.',
      badge: 'Bebas Pilih Hari',
      color: '#fbbf24',
    },
    {
      title: 'Kupon Ratu Sehari (Queen of The Day)',
      icon: Crown,
      desc: 'Satu hari penuh di mana semua keinginanmu akan selalu kuusahakan dan kuwujudkan dengan senyuman!',
      badge: 'Super Eksklusif',
      color: '#a78bfa',
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
      {/* Background starlight particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255, 77, 141, 0.18) 0%, rgba(194, 24, 91, 0.1) 40%, transparent 70%)',
            filter: 'blur(60px)',
          }}
        />
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-5 right-5 z-[100001] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-110 active:scale-95 shadow-xl"
        style={{
          background: 'rgba(61, 10, 37, 0.8)',
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
            /* ================= STATE 1: MYSTERY COSMIC VAULT ================= */
            <motion.div
              key="locked-vault"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center p-8 sm:p-12 rounded-3xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 10, 37, 0.9), rgba(26, 4, 16, 0.95))',
                border: '1px solid rgba(255, 77, 141, 0.35)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 50px rgba(255, 77, 141, 0.25)',
              }}
            >
              <motion.div
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full mb-6 text-[11px] font-mono tracking-widest uppercase"
                style={{
                  background: 'rgba(255, 77, 141, 0.15)',
                  border: '1px solid rgba(255, 77, 141, 0.4)',
                  color: '#fda4af',
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-300 animate-spin" />
                <span>KAPSUL RAHASIA RESMI SEMESTA</span>
              </motion.div>

              <h2 className="font-display text-3xl sm:text-4xl text-white font-normal mb-3">
                Sebuah Rahasia Tersembunyi Khusus Untuk{' '}
                <span className="font-script text-4xl sm:text-5xl gradient-text-pink block sm:inline mt-1">
                  {partnerName} ❤️
                </span>
              </h2>

              <p className="font-body text-xs sm:text-sm text-pink-200/80 max-w-md mx-auto mb-10 leading-relaxed font-light">
                Pesan ini terkunci di kedalaman orbit cinta terkuat di galaksi. Hanya sentuhan tanganmu yang dapat membukanya.
              </p>

              {/* Pulsing Hologram Lock / Heart Orb */}
              <div className="relative w-36 h-36 mx-auto mb-10 flex items-center justify-center">
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: '2px dashed rgba(255, 77, 141, 0.5)',
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
                />
                <motion.div
                  className="absolute inset-2 rounded-full"
                  style={{
                    border: '1px solid rgba(251, 191, 36, 0.4)',
                  }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                />

                <motion.button
                  whileHover={{ scale: 1.12 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={handleUnlock}
                  className="w-24 h-24 rounded-full flex flex-col items-center justify-center cursor-pointer shadow-2xl relative z-10 transition-shadow"
                  style={{
                    background: 'linear-gradient(135deg, #ff4d8d, #be123c)',
                    boxShadow: '0 0 35px rgba(255, 77, 141, 0.7), inset 0 0 15px rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <Lock className="w-8 h-8 text-white mb-1" />
                  <span className="text-[10px] font-mono tracking-wider text-pink-100 font-semibold uppercase">
                    Buka
                  </span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleUnlock}
                className="btn-cosmic px-8 py-3 text-xs sm:text-sm tracking-wider font-medium cursor-pointer inline-flex items-center gap-2 shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 77, 141, 0.3), rgba(194, 24, 91, 0.3))',
                  border: '1px solid rgba(255, 77, 141, 0.5)',
                  color: '#fda4af',
                }}
              >
                <Unlock className="w-4 h-4 text-pink-300" />
                <span>Sentuh Untuk Membuka Rahasia ✨</span>
              </motion.button>
            </motion.div>
          ) : (
            /* ================= STATE 2: THE SECRET SANCTUM ================= */
            <motion.div
              key="unlocked-sanctum"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl p-5 sm:p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(61, 10, 37, 0.95), rgba(26, 4, 16, 0.98))',
                border: '1px solid rgba(255, 77, 141, 0.4)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 77, 141, 0.25)',
              }}
            >
              {/* Header Title */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] uppercase text-pink-300 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>KAPSUL CINTA BERHASIL TERBUKA</span>
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-light text-white">
                  Rahasia Terindah Untuk{' '}
                  <span className="font-script text-3xl sm:text-4xl text-glow-pink" style={{ color: '#ff70a6' }}>
                    {partnerName}
                  </span>
                </h3>
              </div>

              {/* Navigation Tabs (4 Professional Tabs) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6 p-1.5 rounded-2xl bg-black/40 border border-pink-500/20">
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
                      className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all duration-300"
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
              <div className="min-h-[320px] max-h-[60vh] overflow-y-auto pr-1">
                {/* TAB 1: SURAT RAHASIA */}
                {activeTab === 'letter' && (
                  <motion.div
                    key="tab-letter"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 sm:p-7 rounded-2xl relative"
                    style={{
                      background: 'rgba(38, 6, 23, 0.7)',
                      border: '1px solid rgba(255, 77, 141, 0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between border-b border-pink-500/20 pb-3 mb-4 text-xs font-mono text-pink-300">
                      <span>KEPADA: {partnerName.toUpperCase()}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-pink-900/40 border border-pink-500/30">
                        TERSEGEL ABADI ⚜️
                      </span>
                    </div>

                    <div className="font-body text-xs sm:text-sm text-pink-100/90 leading-relaxed space-y-4 font-light">
                      <p>
                        Jika ada satu hal yang paling ingin kukatakan padamu di hari istimewa ini, itu adalah betapa bersyukurnya aku karena semesta mempertemukanku denganmu.
                      </p>
                      <p>
                        Di antara miliaran orang di dunia, kamu adalah satu-satunya yang mampu membuat duniaku terasa jauh lebih damai, lebih bermakna, dan penuh dengan warna-warna bahagia. Senyummu adalah alasan terbaik bagiku untuk selalu bersemangat menyambut hari esok.
                      </p>
                      <p>
                        Terima kasih sudah menjadi sosok yang begitu luar biasa, penuh kehangatan, dan selalu mengerti diriku. Selamat ulang tahun, cintaku. Semoga segala kebaikan, kesehatan, dan kebahagiaan paling tulus selalu menyertai setiap hembusan napasmu.
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between text-xs">
                      <span className="text-pink-300/80 font-script text-2xl">Dengan segenap cintaku,</span>
                      <span className="font-display text-white font-medium tracking-wider">{senderName} ❤️</span>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: 5 JANJI CINTA */}
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
                          className="p-4 rounded-2xl cursor-pointer transition-all duration-300"
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
                              <div
                                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{
                                  background: `linear-gradient(135deg, ${p.color}40, rgba(20,4,14,0.8))`,
                                  border: `1px solid ${p.color}60`,
                                }}
                              >
                                <Icon className="w-4 h-4" style={{ color: p.color }} />
                              </div>
                              <h4 className="font-display text-sm sm:text-base font-medium text-white">
                                {idx + 1}. {p.title}
                              </h4>
                            </div>
                            <span className="text-xs text-pink-300/80 font-mono">
                              {isOpen ? 'Terbuka ✨' : 'Sentuh 🔒'}
                            </span>
                          </div>

                          {isOpen && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="mt-3 pl-11 font-body text-xs text-pink-100/85 leading-relaxed font-light"
                            >
                              "{p.desc}"
                            </motion.p>
                          )}
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}

                {/* TAB 3: KUPON CINTA */}
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
                          className="p-4 rounded-2xl flex flex-col justify-between relative overflow-hidden transition-all duration-300"
                          style={{
                            background: isClaimed
                              ? 'linear-gradient(135deg, rgba(61, 10, 37, 0.9), rgba(30, 4, 18, 0.9))'
                              : 'linear-gradient(135deg, rgba(45, 8, 28, 0.7), rgba(20, 3, 12, 0.8))',
                            border: isClaimed
                              ? '1px solid rgba(251, 191, 36, 0.5)'
                              : '1px solid rgba(255, 77, 141, 0.25)',
                          }}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
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

                            <h4 className="font-display text-base font-medium text-white mb-1.5">
                              {c.title}
                            </h4>
                            <p className="font-body text-[11px] text-pink-200/75 leading-relaxed font-light mb-4">
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

                {/* TAB 4: SERTIFIKAT CINTA RESMI */}
                {activeTab === 'certificate' && (
                  <motion.div
                    key="tab-cert"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 sm:p-8 rounded-3xl relative overflow-hidden text-center"
                    style={{
                      background: 'radial-gradient(ellipse at center, rgba(61, 10, 37, 0.95), rgba(20, 3, 12, 0.98))',
                      border: '2px solid rgba(251, 191, 36, 0.6)',
                      boxShadow: '0 0 30px rgba(251, 191, 36, 0.15)',
                    }}
                  >
                    {/* Inner certificate border decoration */}
                    <div
                      className="absolute inset-2 rounded-2xl pointer-events-none"
                      style={{ border: '1px dashed rgba(251, 191, 36, 0.35)' }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-amber-300" />
                        <span className="text-[11px] font-mono tracking-[0.25em] text-amber-300 uppercase font-semibold">
                          OFFICIAL COSMIC CERTIFICATE
                        </span>
                        <Award className="w-5 h-5 text-amber-300" />
                      </div>

                      <h3 className="font-display text-xl sm:text-2xl font-light text-white mb-4">
                        SERTIFIKAT KEPEMILIKAN BINTANG CINTA
                      </h3>

                      <p className="font-body text-xs text-pink-200/80 mb-2 font-light">
                        Dengan ini dinyatakan secara sah dan abadi kepada:
                      </p>

                      <div className="my-3">
                        <span className="font-script text-4xl sm:text-5xl text-glow-pink gradient-text-pink block">
                          {partnerName}
                        </span>
                        <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-amber-300 to-transparent mx-auto mt-2" />
                      </div>

                      <p className="font-body text-xs sm:text-sm text-pink-100/90 max-w-md mx-auto leading-relaxed font-light mb-6">
                        Bahwa kamu adalah pemilik tunggal dan sah dari seluruh cinta, kesetiaan, dan doa terbaik di alam semesta ini. Berlaku dari detik ini hingga waktu tak lagi berputar.
                      </p>

                      <div className="grid grid-cols-2 gap-4 border-t border-b border-amber-300/20 py-3 my-4 text-xs font-mono">
                        <div>
                          <span className="text-pink-400/80 block text-[10px]">PEMBERI SERTIFIKAT</span>
                          <span className="text-white font-medium">{senderName} ❤️</span>
                        </div>
                        <div>
                          <span className="text-pink-400/80 block text-[10px]">KODE REGISTRASI</span>
                          <span className="text-amber-300 font-medium">COSMIC-REG-MUTIA-2026</span>
                        </div>
                      </div>

                      <button
                        onClick={handleCopyCertificate}
                        className="btn-cosmic px-6 py-2.5 text-xs font-medium cursor-pointer inline-flex items-center gap-2 shadow-lg mt-2"
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
                            <span>Salin Sertifikat Untuk Disimpan / Story Instagram</span>
                          </>
                        )}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-pink-500/20 flex items-center justify-between">
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
    </motion.div>
  );
}
