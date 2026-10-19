import { motion } from 'framer-motion';

// Puffy Cotton Candy Cloud Component (Gulali Putih Bersinar)
function GulaliCloud({
  width = 320,
  height = 160,
  flip = false,
  glowColor = 'rgba(255, 112, 166, 0.4)',
}: {
  width?: number;
  height?: number;
  flip?: boolean;
  glowColor?: string;
}) {
  return (
    <div
      style={{
        width: `${width}px`,
        height: `${height}px`,
        transform: flip ? 'scaleX(-1)' : 'none',
        filter: `drop-shadow(0 10px 30px ${glowColor}) drop-shadow(0 0 20px rgba(255, 255, 255, 0.7))`,
      }}
    >
      <svg
        viewBox="0 0 360 180"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="gulaliBaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.94" />
            <stop offset="85%" stopColor="#fff0f5" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#fed7e2" stopOpacity="0.85" />
          </linearGradient>
          <radialGradient id="gulaliPuffGlow" cx="50%" cy="40%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Fluffy Cotton Candy Cloud Silhouette */}
        <path
          d="M 65 135
             C 35 135, 15 115, 22 88
             C 18 62, 45 42, 72 48
             C 82 22, 118 6, 155 16
             C 180 2, 220 2, 245 22
             C 270 16, 302 32, 312 58
             C 338 68, 350 98, 335 125
             C 340 140, 325 152, 305 152
             L 65 152 Z"
          fill="url(#gulaliBaseGrad)"
        />

        {/* Inner Soft Billows for Marshmallow Cotton Candy Depth */}
        <ellipse cx="150" cy="52" rx="48" ry="32" fill="url(#gulaliPuffGlow)" />
        <ellipse cx="230" cy="50" rx="52" ry="34" fill="url(#gulaliPuffGlow)" />
        <ellipse cx="85" cy="88" rx="38" ry="26" fill="url(#gulaliPuffGlow)" />
        <ellipse cx="285" cy="90" rx="42" ry="28" fill="url(#gulaliPuffGlow)" />
        <ellipse cx="190" cy="95" rx="70" ry="35" fill="url(#gulaliPuffGlow)" />

        {/* Dreamy Sugar Sparkles on Cotton Candy */}
        <circle cx="110" cy="40" r="2.5" fill="#ffffff" opacity="0.9" />
        <circle cx="210" cy="30" r="3" fill="#ffffff" opacity="0.95" />
        <circle cx="270" cy="70" r="2" fill="#ffffff" opacity="0.85" />
      </svg>
    </div>
  );
}

export default function DreamyClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[2] overflow-hidden">
      {/* 1. Large Top Cotton Candy Cloud (Drifting Left to Right) */}
      <motion.div
        className="absolute top-[6%] left-[-350px]"
        initial={{ x: '-10vw' }}
        animate={{
          x: ['0vw', '135vw'],
          y: [0, 14, -12, 0],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <GulaliCloud width={380} height={190} glowColor="rgba(255, 112, 166, 0.45)" />
      </motion.div>

      {/* 2. Fluffy Mid-Right Cotton Candy Cloud (Drifting Right to Left) */}
      <motion.div
        className="absolute top-[32%] right-[-360px]"
        initial={{ x: '10vw' }}
        animate={{
          x: ['0vw', '-140vw'],
          y: [0, -18, 15, 0],
        }}
        transition={{
          duration: 44,
          repeat: Infinity,
          ease: 'linear',
          delay: 4,
        }}
      >
        <GulaliCloud width={420} height={210} flip={true} glowColor="rgba(251, 113, 133, 0.5)" />
      </motion.div>

      {/* 3. Mid-Lower Sweet Cotton Candy Cloud (Drifting Left to Right) */}
      <motion.div
        className="absolute top-[58%] left-[-300px]"
        initial={{ x: '-5vw' }}
        animate={{
          x: ['0vw', '130vw'],
          y: [0, 16, -14, 0],
        }}
        transition={{
          duration: 34,
          repeat: Infinity,
          ease: 'linear',
          delay: 14,
        }}
      >
        <GulaliCloud width={340} height={170} glowColor="rgba(255, 182, 193, 0.55)" />
      </motion.div>

      {/* 4. Bottom Billowing Cotton Candy Cloud (Drifting Right to Left) */}
      <motion.div
        className="absolute top-[78%] right-[-320px]"
        initial={{ x: '5vw' }}
        animate={{
          x: ['0vw', '-135vw'],
          y: [0, -15, 12, 0],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear',
          delay: 8,
        }}
      >
        <GulaliCloud width={360} height={180} flip={true} glowColor="rgba(244, 114, 182, 0.45)" />
      </motion.div>

      {/* 5. Cute Mini Floating Cotton Candy Cloud (Higher Sky) */}
      <motion.div
        className="absolute top-[20%] left-[-220px]"
        initial={{ x: '-8vw' }}
        animate={{
          x: ['0vw', '125vw'],
          y: [0, -10, 10, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: 'linear',
          delay: 20,
        }}
      >
        <GulaliCloud width={240} height={120} glowColor="rgba(255, 192, 203, 0.4)" />
      </motion.div>

      {/* Subtle soft cosmic pink nebula mist in background for extra atmospheric warmth */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[20%] w-[500px] h-[300px] rounded-[100%] opacity-25 blur-[70px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(255, 77, 141, 0.4), transparent 70%)' }}
        />
        <div
          className="absolute top-[60%] right-[15%] w-[600px] h-[350px] rounded-[100%] opacity-25 blur-[80px]"
          style={{ background: 'radial-gradient(ellipse at center, rgba(190, 18, 60, 0.35), transparent 70%)' }}
        />
      </div>
    </div>
  );
}
