import { useEffect, useRef } from 'react';
import { useScrollCtx } from '@/hooks/useScrollContext';
import { useMotionValueEvent } from 'motion/react';

/**
 * Layered video backdrop:
 *   - Layer A: full-bleed Video.mp4, heavily CSS-blurred (the "atmosphere")
 *   - Layer B: same Video.mp4 (HTTP-cached), centered, radial-masked so the
 *     girl region stays slightly visible while the periphery dissolves
 * Both layers share a single source so the browser only fetches once.
 */
export function MediaBackdrop() {
  const blurRef = useRef<HTMLVideoElement>(null);
  const sharpRef = useRef<HTMLVideoElement>(null);
  const { progress, velocity } = useScrollCtx();

  // Slowly desaturate as we approach the morph
  useMotionValueEvent(progress, 'change', (p) => {
    const sat = 1.1 - Math.max(0, Math.min(1, (p - 0.55) / 0.2)) * 0.85;
    const dim = 1 - Math.max(0, Math.min(1, (p - 0.6) / 0.3)) * 0.55;
    if (blurRef.current) {
      blurRef.current.style.filter = `blur(28px) saturate(${sat.toFixed(2)}) brightness(${(0.55 * dim + 0.15).toFixed(2)})`;
    }
    if (sharpRef.current) {
      sharpRef.current.style.opacity = String(0.62 * dim);
    }
  });

  useMotionValueEvent(velocity, 'change', (v) => {
    const tilt = Math.max(-1, Math.min(1, v / 1500));
    if (sharpRef.current) {
      sharpRef.current.style.transform = `translateX(${(tilt * 6).toFixed(1)}px) scale(1.04)`;
    }
  });

  // Try playing on mount (some browsers need an explicit play)
  useEffect(() => {
    const tryPlay = (el: HTMLVideoElement | null) => {
      if (!el) return;
      const p = el.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };
    tryPlay(blurRef.current);
    tryPlay(sharpRef.current);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Layer A: blurred atmosphere */}
      <video
        ref={blurRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: 'blur(28px) saturate(1.1) brightness(0.55)',
          transform: 'scale(1.18)',
        }}
      >
        <source src="/Video.mp4" type="video/mp4" />
      </video>

      {/* Layer B: same source, radial-masked to highlight the girl region */}
      <video
        ref={sharpRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute left-1/2 top-1/2 w-[110%] h-[110%] object-cover"
        style={{
          transform: 'translate(-50%, -50%) scale(1.04)',
          opacity: 0.62,
          WebkitMaskImage:
            'radial-gradient(ellipse 32% 50% at 50% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 78%)',
          maskImage:
            'radial-gradient(ellipse 32% 50% at 50% 50%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0) 78%)',
          mixBlendMode: 'screen',
          filter: 'saturate(1.05) contrast(1.05)',
        }}
      >
        <source src="/Video.mp4" type="video/mp4" />
      </video>

      {/* Vignette + cyberpunk wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 70% 40%, rgba(15, 6, 26, 0.0) 0%, rgba(6, 5, 8, 0.55) 60%, rgba(2, 1, 4, 0.92) 100%)',
        }}
      />
      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background:
            'linear-gradient(180deg, rgba(255, 92, 209, 0.04) 0%, rgba(108, 246, 255, 0.025) 50%, rgba(255, 134, 81, 0.05) 100%)',
        }}
      />
    </div>
  );
}
