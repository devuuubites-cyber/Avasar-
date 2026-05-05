import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';

export function Chrome() {
  const { muted, toggleMute } = useAudio();
  return (
    <>
      <div className="fixed top-6 left-6 md:top-8 md:left-10 z-50 flex items-center gap-3 pointer-events-auto">
        <span className="block w-1.5 h-1.5 rounded-full bg-[var(--color-wheel-pink)] animate-pulse" />
        <span className="font-display text-[12px] uppercase tracking-[0.4em] text-[var(--color-ink)]">
          AVASAR<span className="text-[var(--color-ink-faint)]"> / 24</span>
        </span>
      </div>

      <button
        type="button"
        onClick={toggleMute}
        aria-label={muted ? 'Unmute' : 'Mute'}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-10 z-50 w-9 h-9 flex items-center justify-center rounded-sm border border-[var(--color-ink-faint)]/40 bg-[var(--color-void)]/60 backdrop-blur-sm hover:border-[var(--color-wheel-pink)]/60 transition-colors pointer-events-auto"
      >
        {muted ? (
          <VolumeX className="w-4 h-4 text-[var(--color-ink-dim)]" />
        ) : (
          <Volume2 className="w-4 h-4 text-[var(--color-wheel-blue)]" />
        )}
      </button>
    </>
  );
}
