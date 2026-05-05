import { motion, useTransform } from 'motion/react';
import { useScrollCtx } from '@/hooks/useScrollContext';

/**
 * Bridging visual that fills the gap between the wheel section and the
 * Shamoni panel. Provides:
 *  - A radial flash that expands from screen center as morph progresses
 *  - A dimmer that pushes everything to black at morph=1 so the next
 *    section's clipPath reveal can take over cleanly
 */
export function WheelMorph() {
  const { morph } = useScrollCtx();

  const flashOpacity = useTransform(morph, [0, 0.45, 0.7, 1], [0, 0.55, 0.92, 0]);
  const flashScale = useTransform(morph, [0, 0.6, 1], [0.1, 1.2, 2.5]);
  const dimOpacity = useTransform(morph, [0.5, 1], [0, 0.95]);
  const ringOpacity = useTransform(morph, [0, 0.3, 0.8, 1], [0, 0.7, 0.4, 0]);

  return (
    <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
      {/* Radial flash from center */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{
          width: '60vmin',
          height: '60vmin',
          marginLeft: '-30vmin',
          marginTop: '-30vmin',
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(255, 234, 209, 0.85) 0%, rgba(255, 92, 209, 0.45) 35%, rgba(108, 246, 255, 0.18) 65%, rgba(0, 0, 0, 0) 80%)',
          mixBlendMode: 'screen',
          filter: 'blur(8px)',
          scale: flashScale,
          opacity: flashOpacity,
        }}
      />

      {/* Expanding ring */}
      <motion.div
        className="absolute top-1/2 left-1/2"
        style={{
          width: '40vmin',
          height: '40vmin',
          marginLeft: '-20vmin',
          marginTop: '-20vmin',
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.85)',
          boxShadow: '0 0 60px 8px rgba(255, 92, 209, 0.65), inset 0 0 40px rgba(108, 246, 255, 0.4)',
          scale: useTransform(morph, [0, 1], [0.15, 4]),
          opacity: ringOpacity,
        }}
      />

      {/* Final dimmer to black */}
      <motion.div
        className="absolute inset-0 bg-[var(--color-void)]"
        style={{ opacity: dimOpacity }}
      />
    </div>
  );
}
