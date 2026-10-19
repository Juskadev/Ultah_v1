import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, Sun, Smile, Stars, Coffee } from 'lucide-react';

interface HappyItem {
  icon: any;
  title: string;
  desc: string;
  color: string;
}

const HAPPY_REASONS: HappyItem[] = [
  {
    icon: Smile,
    title: 'Senyuman Manismu',
    desc: 'Setiap kali melihat senyum dan tawamu, semua lelah dan rasa berat di hariku seketika hilang begitu saja.',
    color: '#fb7185',
  },
  {
    icon: Stars,
    title: 'Tatap Matamu yang Teduh',
    desc: 'Caramu menatapku selalu membuatku merasa tenang, dihargai, dan menjadi orang paling beruntung di dunia.',
    color: '#f472b6',
  },
  {
    icon: Coffee,
    title: 'Obrolan Sederhana Kita',
    desc: 'Dari lelucon receh, cerita seharian, hingga obrolan larut malam—setiap detik bersamamu tak pernah membosankan.',
    color: '#fbbf24',
  },
  {
    icon: Heart,
    title: 'Caramu Memanggil Namaku',
    desc: 'Suaramu saat memanggilku selalu punya kehangatan tersendiri yang membuat hatiku bergetar bahagia.',
    color: '#e11d48',
  },
  {
    icon: Sun,
    title: 'Teman Petualangan Terbaik',
    desc: 'Setiap tempat yang kita singgahi bersama—mulai dari pantai hingga malam di bawah lampu kota—selalu jadi kenangan terindah.',
    color: '#38bdf8',
  },
  {
    icon: Sparkles,
    title: 'Kehadiranmu yang Menenangkan',
    desc: 'Hanya dengan duduk berdampingan denganmu tanpa banyak kata pun, duniaku sudah terasa begitu utuh dan lengkap.',
    color: '#a78bfa',
  },
];

export default function HappyMoments() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-60px' });
  const [clickedHeart, setClickedHeart] = useState(false);
  const [activeQuote, setActiveQuote] = useState<string | null>(null);

  const handleSparkleClick = (e: React.MouseEvent) => {
    setClickedHeart(true);
    setActiveQuote('Terima kasih sudah menjadi alasan terbesarku untuk selalu tersenyum setiap hari ❤️');

    // Confetti burst
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
      colors: ['#fb7185', '#fda4af', '#f472b6', '#fbbf24'],
    });

    setTimeout(() => {
      setClickedHeart(false);
    }, 4000);
  };

  return (
    <section ref={ref} id="happy" className="relative py-24 px-4 md:px-8 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(251, 113, 133, 0.12), transparent)',
            filter: 'blur(50px)',
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Title */}
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-body text-xs tracking-[0.3em] uppercase mb-3 text-pink-400 font-semibold"
          >
            ✦ SUMBER KEBAHAGIAANKU ✦
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl font-light gradient-text-pink mb-4"
          >
            Hal-Hal Kecil Bersamamu yang Selalu Membuatku Bahagia
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{
              width: '80px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #fb7185, transparent)',
              margin: '20px auto',
            }}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-body text-sm font-light max-w-xl mx-auto text-purple-200/80 leading-relaxed"
          >
            Di antara miliaran hal di dunia, hal-hal sederhana bersamamulah yang selalu membuat hariku jauh lebih indah dan berarti.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {HAPPY_REASONS.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-strong rounded-3xl p-6 border border-pink-500/20 hover:border-pink-500/50 transition-all duration-300 relative group overflow-hidden flex flex-col justify-between"
                style={{
                  background: 'rgba(26, 10, 36, 0.75)',
                }}
              >
                {/* Subtle top glow line */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${item.color}, transparent)`,
                  }}
                />

                <div>
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-lg"
                    style={{
                      background: `radial-gradient(circle, ${item.color}35, rgba(18,8,42,0.8))`,
                      border: `1px solid ${item.color}50`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: item.color }} />
                  </div>

                  <h3 className="font-display text-xl text-white font-medium mb-2 group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="font-body text-xs text-purple-200/80 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-purple-500/15 flex items-center justify-between text-[11px] text-pink-400/80 font-mono">
                  <span>Alasan #{index + 1}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">❤️</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Happiness Trigger Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <button
            onClick={handleSparkleClick}
            className={`btn-cosmic px-8 py-3.5 text-xs sm:text-sm font-medium tracking-wider cursor-pointer inline-flex items-center gap-2 shadow-lg transition-transform ${clickedHeart ? 'scale-105' : ''}`}
            style={{
              background: clickedHeart 
                ? 'linear-gradient(135deg, rgba(251, 113, 133, 0.6), rgba(225, 29, 72, 0.6))'
                : 'linear-gradient(135deg, rgba(251, 113, 133, 0.3), rgba(225, 29, 72, 0.3))',
              border: '1px solid rgba(251, 113, 133, 0.5)',
              color: '#fda4af',
            }}
          >
            <Sparkles className={`w-4 h-4 text-pink-300 ${clickedHeart ? 'animate-spin' : ''}`} />
            <span>{clickedHeart ? 'Pesan Terkirim dengan Cinta! ❤️' : 'Sentuh untuk Pesan Manis Tambahan ✨'}</span>
          </button>

          {activeQuote && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 font-script text-2xl sm:text-3xl text-glow-pink"
              style={{ color: '#fda4af' }}
            >
              "{activeQuote}"
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
