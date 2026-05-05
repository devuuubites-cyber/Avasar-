import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  AdditiveBlending,
  BufferAttribute,
  CanvasTexture,
  Color,
  type Points,
} from 'three';
import { palette } from '@/lib/palette';
import { useDiscAnchor } from './Disc';

const COUNT = 180;

/** Generate a soft radial-gradient texture once for the dust sprite. */
function makeSoftSprite(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0.0, 'rgba(255, 255, 255, 1.0)');
  grad.addColorStop(0.4, 'rgba(255, 255, 255, 0.55)');
  grad.addColorStop(1.0, 'rgba(255, 255, 255, 0.0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/**
 * Soft circular dust drifting around the disc. Uses a programmatic radial-
 * gradient sprite so each particle is a soft round mote, not a flat pixel
 * square. Lives in its own group so it doesn't inherit the disc's spin.
 */
export function Dust() {
  const ref = useRef<Points | null>(null);
  const anchorX = useDiscAnchor();

  const sprite = useMemo(makeSoftSprite, []);

  const { positions, colors, seeds } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const c = new Float32Array(COUNT * 3);
    const sd = new Float32Array(COUNT);
    const cyan = new Color(palette.wheelBlue);
    const magenta = new Color(palette.wheelPink);
    for (let i = 0; i < COUNT; i++) {
      const r = 0.5 + Math.random() * 2.4;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3 + 0] = Math.cos(theta) * r;
      p[i * 3 + 1] = (Math.random() - 0.4) * 2.6;
      p[i * 3 + 2] = Math.sin(theta) * r * 0.45 + (Math.random() - 0.5) * 0.6;
      const col = Math.random() < 0.55 ? cyan : magenta;
      c[i * 3 + 0] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
      sd[i] = Math.random() * 1000;
    }
    return { positions: p, colors: c, seeds: sd };
  }, []);

  useFrame((state, dt) => {
    const points = ref.current;
    if (!points) return;
    points.position.x = anchorX;
    const posAttr = points.geometry.getAttribute('position') as BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += dt * 0.04;
      arr[i * 3 + 0] += Math.sin(t * 0.4 + seeds[i]) * dt * 0.015;
      if (arr[i * 3 + 1] > 1.6) arr[i * 3 + 1] = -1.6;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        map={sprite}
        vertexColors
        size={0.022}
        sizeAttenuation
        transparent
        opacity={0.8}
        depthWrite={false}
        blending={AdditiveBlending}
        alphaTest={0.001}
      />
    </points>
  );
}
