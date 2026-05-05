import { lazy, Suspense } from 'react';
import { ScrollProvider } from '@/hooks/useScrollContext';
import { MediaBackdrop } from '@/components/Background/MediaBackdrop';
import { WheelScene } from '@/components/Wheel/WheelScene';
import { WheelMorph } from '@/components/Wheel/WheelMorph';
import { Hero } from '@/components/Overlay/Hero';
import { SegmentReveal } from '@/components/Overlay/SegmentReveal';
import { HeaderChrome } from '@/components/Overlay/HeaderChrome';
import { AudioToggle } from '@/components/Overlay/AudioToggle';

const ShamoniPanel = lazy(() => import('@/components/FinalPanel/ShamoniPanel'));

export default function App() {
  return (
    <ScrollProvider>
      <div className="grain relative min-h-screen text-[var(--color-ink)]">
        <MediaBackdrop />
        <HeaderChrome />
        <AudioToggle />

        {/* Wheel + morph: 1300vh tall, inner sticky stage holds canvas + overlays */}
        <section className="relative w-full h-[1300vh]">
          <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
            <WheelScene />
            <Hero />
            <SegmentReveal />
            <WheelMorph />
          </div>
        </section>

        {/* Shamoni final panel — its own 600vh internal scroll scope */}
        <Suspense fallback={null}>
          <ShamoniPanel />
        </Suspense>

        <footer className="relative z-10 py-12 px-6 md:px-16 text-center text-[10px] uppercase tracking-[0.5em] font-mono text-[var(--color-ink-faint)]">
          Avasar © Strategic Future Studies
        </footer>
      </div>
    </ScrollProvider>
  );
}
