import { createContext, useContext, useEffect, useMemo, type ReactNode } from 'react';
import { createElement } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useMotionValue, type MotionValue } from 'motion/react';

gsap.registerPlugin(ScrollTrigger);

export const SCENE_COUNT = 6;
/** Wheel section spans 0..0.85 of total document height; remainder is Shamoni. */
export const WHEEL_END = 0.85;

export type ScrollCtx = {
  /** 0..1 across the full document */
  progress: MotionValue<number>;
  /** 0..1 within the wheel section */
  wheel: MotionValue<number>;
  /** 0..(SCENE_COUNT-1), integer scene index inside the wheel section */
  scene: MotionValue<number>;
  /** Lenis velocity in px/s */
  velocity: MotionValue<number>;
};

const Ctx = createContext<ScrollCtx | null>(null);

export function ScrollProvider({ children }: { children: ReactNode }) {
  const progress = useMotionValue(0);
  const wheel = useMotionValue(0);
  const scene = useMotionValue(0);
  const velocity = useMotionValue(0);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      lerp: 0.085,
    });

    const handleScroll = () => {
      const max = lenis.limit || 1;
      const p = max > 0 ? lenis.scroll / max : 0;
      progress.set(p);
      const w = Math.max(0, Math.min(1, p / WHEEL_END));
      wheel.set(w);
      const s = Math.max(0, Math.min(SCENE_COUNT - 1, Math.floor(w * SCENE_COUNT)));
      scene.set(s);
      velocity.set(lenis.velocity);
    };

    lenis.on('scroll', handleScroll);
    lenis.on('scroll', ScrollTrigger.update);
    handleScroll();

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, [progress, wheel, scene, velocity]);

  const ctx = useMemo<ScrollCtx>(
    () => ({ progress, wheel, scene, velocity }),
    [progress, wheel, scene, velocity],
  );

  return createElement(Ctx.Provider, { value: ctx }, children);
}

export function useScrollCtx() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useScrollCtx must be used inside <ScrollProvider>');
  return v;
}
