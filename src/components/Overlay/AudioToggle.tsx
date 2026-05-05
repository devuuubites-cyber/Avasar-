import { Volume2, VolumeX } from 'lucide-react';
import { useAudio } from '@/hooks/useAudio';
import { cn } from '@/lib/cn';

export function AudioToggle() {
  const { muted, toggleMute } = useAudio();
  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? 'Unmute' : 'Mute'}
      className={cn(
        'fixed z-50 right-6 md:right-10 bottom-6 md:bottom-10 group flex items-center gap-2 px-4 py-2 cursor-pointer pointer-events-auto select-none',
        'rounded-full border border-white/10 bg-black/40 backdrop-blur-md transition-colors hover:bg-black/60',
      )}
    >
      {muted ? (
        <VolumeX className="w-4 h-4 text-[var(--color-ink-dim)]" />
      ) : (
        <Volume2 className="w-4 h-4 text-[var(--color-pulse)]" />
      )}
      <span className="text-[10px] uppercase tracking-[0.32em] font-mono text-[var(--color-ink-dim)]">
        {muted ? 'Sound Off' : 'Sound On'}
      </span>
    </button>
  );
}
