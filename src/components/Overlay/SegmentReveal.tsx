import { useEffect, useState } from 'react';
import { motion, useTransform } from 'motion/react';
import { segments } from '@/content/segments';
import { useScrollCtx } from '@/hooks/useScrollContext';
import { useMotionListener } from '@/hooks/useMotionListener';
import { AnimatedHeading } from './AnimatedHeading';
import { FadeIn } from './FadeIn';

export function SegmentReveal() {
  const { active, wheel, morph } = useScrollCtx();
  const idx = useMotionListener(active);
  const seg = segments[Math.max(0, Math.min(11, idx))];
  const Icon = seg.icon;

  // Show only after the hero fades, hide as morph kicks in
  const opacity = useTransform([wheel, morph] as any, ([w, m]: any) => {
    const enter = Math.max(0, Math.min(1, (w - 0.04) / 0.04));
    const exit = 1 - Math.max(0, Math.min(1, m / 0.4));
    return enter * exit;
  });

  // Defer the AnimatedHeading reset until the index actually changes
  const [internalKey, setInternalKey] = useState(idx);
  useEffect(() => {
    setInternalKey(idx);
  }, [idx]);

  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none flex items-center"
      style={{ opacity }}
    >
      <div className="ml-6 md:ml-16 lg:ml-24 max-w-[560px]">
        {/* counter chip */}
        <div className="flex items-center gap-3 mb-6 text-[var(--color-ink-faint)] font-mono text-[10px] tracking-[0.5em] uppercase">
          <span style={{ color: seg.accent }}>●</span>
          <span>{seg.number} / 12</span>
          <span className="block w-12 h-px bg-[var(--color-ink-faint)]" />
          <span>{seg.rim}</span>
        </div>

        {/* icon + title */}
        <div className="flex items-baseline gap-5">
          <div
            className="flex items-center justify-center w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-full border border-white/10"
            style={{
              boxShadow: `0 0 24px -6px ${seg.accent}`,
              background: 'rgba(0,0,0,0.45)',
            }}
          >
            <Icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: seg.accent }} />
          </div>
          <AnimatedHeading
            text={seg.title}
            delay={120}
            charDelay={26}
            resetKey={internalKey}
            className="font-serif italic text-[var(--color-ink)] leading-[0.95] tracking-tight text-[clamp(36px,5.5vw,72px)]"
          />
        </div>

        <FadeIn delay={520} transitionDuration={900} resetKey={internalKey}>
          <p
            className="mt-6 md:mt-8 max-w-[460px] text-[var(--color-ink-dim)] text-[15px] md:text-[17px] leading-[1.55] tracking-wide"
          >
            {seg.body}
          </p>
        </FadeIn>

        <FadeIn delay={900} transitionDuration={900} resetKey={internalKey}>
          <div className="mt-10 flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] font-mono text-[var(--color-ink-faint)]">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="block h-px transition-all"
                style={{
                  width: i === idx ? 28 : 14,
                  background: i === idx ? seg.accent : 'var(--color-ink-faint)',
                  opacity: i === idx ? 1 : 0.4,
                }}
              />
            ))}
            <span className="ml-3">{seg.morphTarget ? 'CARRIES IMAGE' : 'TEXT ONLY'}</span>
          </div>
        </FadeIn>
      </div>
    </motion.div>
  );
}
