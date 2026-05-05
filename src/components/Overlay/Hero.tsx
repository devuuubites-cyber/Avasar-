import { useTransform } from 'motion/react';
import { motion } from 'motion/react';
import { hero } from '@/content/hero';
import { useScrollCtx } from '@/hooks/useScrollContext';
import { AnimatedHeading } from './AnimatedHeading';
import { FadeIn } from './FadeIn';

export function Hero() {
  const { wheel } = useScrollCtx();
  // Hero is fully visible from wheel=0..0.04, fades out by 0.10
  const heroOpacity = useTransform(wheel, [0, 0.04, 0.1], [1, 1, 0]);
  const heroY = useTransform(wheel, [0, 0.1], [0, -40]);
  const heroBlur = useTransform(wheel, [0, 0.1], [0, 12]);

  return (
    <motion.div
      className="absolute inset-0 z-20 pointer-events-none flex items-center"
      style={{
        opacity: heroOpacity,
        y: heroY,
        filter: useTransform(heroBlur, (b) => `blur(${b}px)`),
      }}
    >
      <div className="ml-6 md:ml-16 lg:ml-24 max-w-[640px]">
        <FadeIn delay={300}>
          <div className="text-[10px] md:text-[11px] uppercase tracking-[0.5em] text-[var(--color-ink-faint)] font-mono mb-6">
            <span className="text-[var(--color-flux)]">●</span>{'  '}
            {hero.eyebrow}
          </div>
        </FadeIn>
        <AnimatedHeading
          text={hero.title}
          delay={500}
          charDelay={32}
          className="font-serif italic text-[var(--color-ink)] leading-[0.95] tracking-tight text-[clamp(48px,8vw,108px)]"
        />
        <FadeIn delay={1900} transitionDuration={1100}>
          <p className="mt-8 max-w-[420px] text-[var(--color-ink-dim)] text-[15px] md:text-[16px] leading-[1.55] tracking-wide">
            {hero.sub}
          </p>
        </FadeIn>
        <FadeIn delay={2400} transitionDuration={900}>
          <div className="mt-12 inline-flex items-center gap-3 text-[10px] md:text-[11px] uppercase tracking-[0.4em] font-mono text-[var(--color-ink-dim)]">
            <span className="block w-10 h-px bg-[var(--color-ink-dim)]" />
            <span>{hero.cta}</span>
            <span className="text-[var(--color-flux)] animate-pulse">↓</span>
          </div>
        </FadeIn>
      </div>
    </motion.div>
  );
}
