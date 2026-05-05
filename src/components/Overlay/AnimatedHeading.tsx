import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

type Props = {
  text: string;
  delay?: number;
  charDelay?: number;
  className?: string;
  align?: 'left' | 'center';
  /** Reset key — when this changes, the animation re-runs from scratch. */
  resetKey?: string | number;
};

/**
 * Splits text on \n and again on characters. Each char is an inline-block
 * <span> with `transition-all duration-500`. Initial state:
 * `opacity: 0, translateX(-18px)`. Final state: `opacity: 1, translateX(0)`.
 * Per-character delay: lineIndex * line.length * charDelay + charIndex * charDelay.
 * Spaces preserved via U+00A0.
 */
export function AnimatedHeading({
  text,
  delay = 0,
  charDelay = 28,
  className,
  align = 'left',
  resetKey,
}: Props) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const id = window.setTimeout(() => setActive(true), delay);
    return () => window.clearTimeout(id);
  }, [delay, resetKey, text]);

  const lines = text.split('\n');
  return (
    <div className={className}>
      {lines.map((line, lineIndex) => {
        const baseDelay = lineIndex * line.length * charDelay;
        const chars = Array.from(line);
        return (
          <div
            key={`line-${lineIndex}`}
            className={cn('flex flex-wrap', align === 'center' ? 'justify-center' : 'justify-start')}
          >
            {chars.map((ch, charIndex) => {
              const d = baseDelay + charIndex * charDelay;
              const display = ch === ' ' ? ' ' : ch;
              return (
                <span
                  key={`c-${lineIndex}-${charIndex}`}
                  className="inline-block transition-all duration-500"
                  style={{
                    transitionDelay: `${d}ms`,
                    opacity: active ? 1 : 0,
                    transform: active ? 'translateX(0)' : 'translateX(-18px)',
                  }}
                >
                  {display}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
