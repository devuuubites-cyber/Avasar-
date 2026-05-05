import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionValue, useMotionValue, type MotionValue } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export type ScrollCtx = {
  /** 0..1 across the entire document */
  progress: MotionValue<number>;
  /** 0..1 across the wheel section (segments 0..11) */
  wheel: MotionValue<number>;
  /** 0..1 across the morph zone */
  morph: MotionValue<number>;
  /** Currently active segment index 0..11 */
  active: MotionValue<number>;
  /** Velocity from Lenis (px/s, signed) */
  velocity: MotionValue<number>;
};

const Ctx = createContext<ScrollCtx | null>(null);

const SEG_COUNT = 12;
// Section boundaries as fractions of total document height
export const WHEEL_END = 12 / 19; // wheel: 0..12/19  (1200vh of 1900vh)
export const MORPH_END = 13 / 19; // morph: 12/19..13/19 (100vh)
// Shamoni: 13/19..1 (600vh)

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progress = useMotionValue(0);
  const wheel = useMotionValue(0);
  const morph = useMotionValue(0);
  const active = useMotionValue(0);
  const velocity = useMotionValue(0);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.085,
    });
    lenisRef.current = lenis;

    const handleScroll = () => {
      const max = lenis.limit || 1;
      const p = max > 0 ? lenis.scroll / max : 0;
      progress.set(p);
      const w = Math.max(0, Math.min(1, p / WHEEL_END));
      wheel.set(w);
      const m = Math.max(0, Math.min(1, (p - WHEEL_END) / (MORPH_END - WHEEL_END)));
      morph.set(m);
      // active segment: clamp wheelProgress * 11 (since 12 segments give 11 transitions)
      const a = Math.round(w * (SEG_COUNT - 1));
      active.set(Math.max(0, Math.min(SEG_COUNT - 1, a)));
      velocity.set(lenis.velocity);
    };

    lenis.on('scroll', handleScroll);
    handleScroll();

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    // Bridge Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(tickerCallback);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [progress, wheel, morph, active, velocity]);

  const ctx: ScrollCtx = useMemo(
    () => ({ progress, wheel, morph, active, velocity }),
    [progress, wheel, morph, active, velocity],
  );

  return <Ctx.Provider value={ctx}>{children}</Ctx.Provider>;
}

export function useScrollCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useScrollCtx must be used inside <ScrollProvider>');
  return v;
}

/** Standalone helper for components that just want the active segment as a state. */
export function useActiveSegment() {
  const { active } = useScrollCtx();
  return active;
}
