import { motion } from 'framer-motion';

export default function DreamyClouds() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Cloud 1: Soft upper floating cloud */}
      <motion.div
        className="absolute w-[600px] h-[220px] rounded-[100%] opacity-20 blur-[45px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 113, 133, 0.45) 0%, rgba(225, 29, 72, 0.2) 50%, transparent 80%)',
          top: '8%',
          left: '-20%',
        }}
        animate={{
          x: ['0vw', '130vw'],
          y: [0, 15, -10, 0],
        }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Cloud 2: Middle cosmic mist */}
      <motion.div
        className="absolute w-[750px] h-[260px] rounded-[100%] opacity-25 blur-[55px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(167, 139, 250, 0.35) 0%, rgba(244, 114, 182, 0.25) 50%, transparent 80%)',
          top: '38%',
          right: '-30%',
        }}
        animate={{
          x: ['0vw', '-140vw'],
          y: [0, -20, 15, 0],
        }}
        transition={{
          duration: 55,
          repeat: Infinity,
          ease: 'linear',
          delay: 5,
        }}
      />

      {/* Cloud 3: Lower dreamy cloud */}
      <motion.div
        className="absolute w-[800px] h-[280px] rounded-[100%] opacity-20 blur-[50px]"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(251, 191, 36, 0.25) 0%, rgba(244, 114, 182, 0.2) 60%, transparent 80%)',
          top: '68%',
          left: '-25%',
        }}
        animate={{
          x: ['0vw', '135vw'],
          y: [0, 20, -15, 0],
        }}
        transition={{
          duration: 50,
          repeat: Infinity,
          ease: 'linear',
          delay: 12,
        }}
      />

      {/* Floating stylized SVG cloud puffs for whimsical romantic depth */}
      <motion.div
        className="absolute top-[22%] left-[-150px] opacity-15"
        animate={{
          x: ['0vw', '125vw'],
          y: [0, 10, -10, 0],
        }}
        transition={{
          duration: 38,
          repeat: Infinity,
          ease: 'linear',
        }}
      >
        <svg width="220" height="90" viewBox="0 0 220 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M40 70C25 70 12 58 12 43C12 29 23 18 37 17C43 8 55 2 68 2C86 2 101 13 105 29C111 25 119 23 127 23C144 23 158 35 161 51C167 51 172 52 176 56C182 62 182 70 176 70H40Z"
            fill="url(#cloudGrad1)"
            filter="drop-shadow(0 0 20px rgba(244, 114, 182, 0.4))"
          />
          <defs>
            <linearGradient id="cloudGrad1" x1="12" y1="2" x2="182" y2="70" gradientUnits="userSpaceOnUse">
              <stop stopColor="#fb7185" stopOpacity="0.8" />
              <stop offset="1" stopColor="#a78bfa" stopOpacity="0.3" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-[60%] right-[-180px] opacity-15"
        animate={{
          x: ['0vw', '-130vw'],
          y: [0, -12, 8, 0],
        }}
        transition={{
          duration: 42,
          repeat: Infinity,
          ease: 'linear',
          delay: 8,
        }}
      >
        <svg width="260" height="110" viewBox="0 0 260 110" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M50 85C30 85 15 70 15 52C15 35 29 21 46 20C54 9 68 2 84 2C106 2 125 15 130 35C138 30 148 27 158 27C179 27 196 42 200 62C207 62 214 63 219 68C226 75 226 85 219 85H50Z"
            fill="url(#cloudGrad2)"
            filter="drop-shadow(0 0 25px rgba(251, 191, 36, 0.35))"
          />
          <defs>
            <linearGradient id="cloudGrad2" x1="15" y1="2" x2="226" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#f472b6" stopOpacity="0.7" />
              <stop offset="1" stopColor="#fbbf24" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </div>
  );
}
