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
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.3;
    if (autoplay) {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [autoplay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };
    const onEnded = () => { audio.currentTime = 0; audio.play(); };
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
      audio.play().catch(() => {});
      setIsPlaying(true);
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
        onError={() => setLoadError(true)}
      />

      <motion.div
        className="music-player glass-strong"
        animate={{ width: expanded ? '260px' : '56px' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{ overflow: 'hidden', border: '1px solid rgba(167,139,250,0.2)' }}
      >
        <div className="flex items-center gap-3 p-3">
          {/* Toggle expand button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
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
              <Music size={14} color="white" />
            )}
          </motion.button>

          {/* Expanded controls */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                {/* Song title */}
                <p className="font-body text-xs truncate mb-2" style={{ color: '#a78bfa', letterSpacing: '0.05em' }}>
                  {loadError ? '♫ No audio file' : `♫ ${title}`}
                </p>

                {/* Progress bar */}
                <div
                  className="h-1 rounded-full overflow-hidden mb-2 cursor-pointer"
                  style={{ background: 'rgba(167,139,250,0.2)' }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const pct = (e.clientX - rect.left) / rect.width;
                    const audio = audioRef.current;
                    if (audio && audio.duration) {
                      audio.currentTime = pct * audio.duration;
                    }
                  }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      width: `${progress}%`,
                      background: 'linear-gradient(90deg, #7c3aed, #f472b6)',
                    }}
                    transition={{ duration: 0.1 }}
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                    style={{ color: '#e2e8f0' }}
                  >
                    {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                  </button>
                  <button
                    onClick={toggleMute}
                    className="w-6 h-6 rounded-full flex items-center justify-center transition-all hover:bg-white/10"
                    style={{ color: isMuted ? '#64748b' : '#e2e8f0' }}
                  >
                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                  </button>
                  <span className="text-xs ml-auto" style={{ color: '#475569' }}>
                    {isPlaying ? '▶' : '⏸'}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}
