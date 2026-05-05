import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { LiquidGlass } from './LiquidGlass';

export function HeaderChrome() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 pt-6 md:pt-8 flex items-start justify-between pointer-events-none">
        <div className="pointer-events-auto select-none">
          <div className="flex items-baseline gap-2">
            <span className="text-[26px] md:text-[34px] leading-none tracking-tight font-serif italic text-[var(--color-ink)]">
              Avasar
            </span>
            <span className="text-[10px] uppercase tracking-[0.32em] text-[var(--color-ink-faint)] font-mono">
              ©
            </span>
          </div>
          <div className="mt-1 text-[9px] md:text-[10px] uppercase tracking-[0.42em] text-[var(--color-ink-faint)] font-mono">
            Strategic Future Studies / 2024
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle navigation"
          className={cn(
            'pointer-events-auto group relative flex items-center justify-center w-[64px] h-[40px] cursor-pointer transition-transform duration-300 hover:scale-105',
          )}
        >
          <div className="absolute inset-0 bg-[var(--color-ink)] rounded-[50%] -rotate-12 mix-blend-difference" />
          <span className="relative z-10">
            {open ? (
              <X className="w-5 h-5 text-[var(--color-void)] mix-blend-difference" />
            ) : (
              <Menu className="w-5 h-5 text-[var(--color-void)] mix-blend-difference" />
            )}
          </span>
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center pointer-events-auto">
          <div
            className="absolute inset-0 bg-[var(--color-void)]/85 backdrop-blur-md"
            onClick={() => setOpen(false)}
          />
          <LiquidGlass className="relative px-12 py-10 max-w-md w-[90%]">
            <div className="text-[10px] uppercase tracking-[0.5em] text-[var(--color-ink-faint)] font-mono mb-6">
              Index — 12 Dispatches
            </div>
            <ol className="space-y-3 font-serif text-[var(--color-ink)]">
              {Array.from({ length: 12 }).map((_, i) => (
                <li key={i} className="flex items-baseline gap-4 text-lg">
                  <span className="text-[var(--color-ink-faint)] font-mono text-xs w-6">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="italic">{getSegmentTitle(i)}</span>
                </li>
              ))}
            </ol>
          </LiquidGlass>
        </div>
      )}
    </>
  );
}

function getSegmentTitle(i: number): string {
  // Inlined to avoid circular import; matches segments.ts
  return [
    'Wetware',
    'Signal Speed',
    'Bandwidth',
    'Emotional Interference',
    'Scalability',
    'The Efficiency Gap',
    'The Big Data Paradox',
    'Evolutionary Stagnation',
    'Economic Inevitability',
    'Algorithmic Dictatorship',
    'Cybernetic Evolution',
    'The Window',
  ][i];
}
