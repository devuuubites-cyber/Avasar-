import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  text: string;
  delay?: number;
  wordDelay?: number;
  particles?: boolean;
  particleCount?: number;
  className?: string;
  resetKey?: string | number;
};

type Particle = { dx: number; dy: number; delay: number; color: 0 | 1 };

function makeParticles(count: number): Particle[] {
  return Array.from({ length: count }, () => ({
    dx: (Math.random() - 0.5) * 28,
    dy: -8 - Math.random() * 22,
    delay: Math.random() * 120,
    color: Math.random() < 0.55 ? 0 : 1,
  }));
}

/**
 * Word-by-word reveal: each word fades in with a blur-to-focus + RGB-split glitch
 * (CSS keyframe `glitchReveal`). Each revealed word emits a small dust puff that
 * drifts upward and dissolves.
 *
 * Reset by changing `resetKey`. Spaces preserved by the natural flex gap.
 */
export function GlitchType({
  text,
  delay = 0,
  wordDelay = 90,
  particles = true,
  particleCount = 6,
  className,
  resetKey,
}: Props) {
  const lines = useMemo(
    () =>
      text
        .split('\n')
        .map((line) => line.trim().split(/\s+/).filter(Boolean)),
    [text],
  );
  const wordCount = lines.reduce((n, l) => n + l.length, 0);

  const [revealed, setRevealed] = useState(0);

  useEffect(() => {
    setRevealed(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < wordCount; i++) {
      timers.push(window.setTimeout(() => setRevealed((r) => Math.max(r, i + 1)), delay + i * wordDelay));
    }
    return () => timers.forEach(clearTimeout);
  }, [delay, wordDelay, wordCount, resetKey, text]);

  let cursor = 0;
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {lines.map((words, li) => (
        <div key={li} className="glitch-line">
          {words.map((word) => {
            const i = cursor++;
            const on = i < revealed;
            return (
              <Word
                key={`${resetKey ?? '-'}-${i}-${word}`}
                word={word}
                on={on}
                particles={on && particles}
                particleCount={particleCount}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Word({
  word,
  on,
  particles,
  particleCount,
}: {
  word: string;
  on: boolean;
  particles: boolean;
  particleCount: number;
}) {
  const [parts, setParts] = useState<Particle[] | null>(null);
  useEffect(() => {
    if (!particles) return;
    setParts(makeParticles(particleCount));
    const id = window.setTimeout(() => setParts(null), 950);
    return () => clearTimeout(id);
  }, [particles, particleCount]);

  return (
    <span className={cn('glitch-word', on && 'is-on')}>
      <span aria-hidden={false}>{word}</span>
      {parts &&
        parts.map((p, i) => (
          <span
            key={i}
            className="glitch-dust"
            style={
              {
                left: '50%',
                top: '50%',
                background: p.color === 0 ? 'var(--color-wheel-blue)' : 'var(--color-wheel-pink)',
                ['--dx' as string]: `${p.dx}px`,
                ['--dy' as string]: `${p.dy}px`,
                ['--delay' as string]: `${p.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
    </span>
  );
}
