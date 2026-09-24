import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';

interface MusicPlayerProps {
  musicSrc: string;
  title: string;
  autoplay?: boolean;
}

export default function MusicPlayer({ musicSrc, title, autoplay = false }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [expanded, setExpanded] = useState(false);

  // iOS Safari & Android audio unlock handler
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;

    const unlockAudio = () => {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {});
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };

    if (autoplay) {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // Fallback: unlock smoothly on first touch/tap/scroll on mobile
        window.addEventListener('touchstart', unlockAudio, { passive: true });
        window.addEventListener('click', unlockAudio);
        window.addEventListener('scroll', unlockAudio, { passive: true });
      });
    }

    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('scroll', unlockAudio);
    };
  }, [autoplay, musicSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={musicSrc}
        loop
        playsInline
      />

      <motion.div
        className="music-player glass-strong fixed bottom-6 right-6 z-40 rounded-full shadow-2xl"
        animate={{ width: expanded ? '260px' : '56px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          overflow: 'hidden',
          border: '1px solid rgba(167,139,250,0.3)',
          background: 'rgba(18,8,42,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center gap-3 p-3">
          {/* Toggle expand button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer shadow-md"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #be185d)', flexShrink: 0 }}
          >
            {/* Equalizer bars when playing */}
            {isPlaying ? (
              <div className="flex gap-0.5 items-end h-4">
                {[1, 2, 3].map(i => (
                  <div
                    key={i}
                    className="eq-bar"
                    style={{
                      height: `${8 + i * 4}px`,
                      animationDelay: `${i * 0.15}s`,
                      animationDuration: `${0.5 + i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <Music className="w-4 h-4 text-white" />
            )}
          </motion.button>

          {/* Expanded controls */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 flex-1 min-w-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-body font-medium truncate text-purple-200">
                    {title}
                  </p>
                  {/* Progress bar */}
                  <div className="w-full h-1 rounded-full overflow-hidden mt-1 bg-purple-950">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #a78bfa, #f472b6)',
                      }}
                    />
                  </div>
                </div>

                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-800/30 transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-800/30 transition-colors cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
