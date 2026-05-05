import { lazy, Suspense } from 'react';
import { ScrollProvider } from '@/hooks/useScroll';
import { Background } from '@/components/Background';
import { Chrome } from '@/components/Chrome';
import { BarrelDefs } from '@/components/BarrelDefs';
import { Wheel } from '@/components/Wheel';

const ShamoniPanel = lazy(() => import('@/components/FinalPanel/ShamoniPanel'));

export default function App() {
  return (
    <ScrollProvider>
      <Background />
      <Chrome />
      <BarrelDefs />

      <main className="relative w-full h-[1400vh]">
        <section className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <Wheel />
        </section>

        <Suspense fallback={null}>
          <ShamoniPanel />
        </Suspense>
      </main>
    </ScrollProvider>
  );
}
