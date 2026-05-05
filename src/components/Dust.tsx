import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, BufferAttribute, Color, type Points } from 'three';
import { palette } from '@/lib/palette';
import { useDiscAnchor } from './Disc';

const COUNT = 220;

/**
 * Particle dust drifting above and around the disc. Lives in its own group so it
 * does NOT inherit the disc's spin. Additive blending keeps it light over Bloom.
 */
export function Dust() {
  const ref = useRef<Points | null>(null);
  const anchorX = useDiscAnchor();

  const { positions, colors, sizes, seeds } = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const c = new Float32Array(COUNT * 3);
    const s = new Float32Array(COUNT);
    const sd = new Float32Array(COUNT);
    const blue = new Color(palette.wheelBlue);
    const pink = new Color(palette.wheelPink);
    for (let i = 0; i < COUNT; i++) {
      // Distribute around the disc (radius ~0..2.4)
      const r = 0.4 + Math.random() * 2.0;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3 + 0] = Math.cos(theta) * r;
      p[i * 3 + 1] = (Math.random() - 0.4) * 2.4;
      p[i * 3 + 2] = Math.sin(theta) * r * 0.4 + (Math.random() - 0.5) * 0.8;
      const t = Math.random();
      const col = t < 0.55 ? blue : pink;
      c[i * 3 + 0] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
      s[i] = 0.012 + Math.random() * 0.024;
      sd[i] = Math.random() * 1000;
    }
    return { positions: p, colors: c, sizes: s, seeds: sd };
  }, []);

  useFrame((state, dt) => {
    const points = ref.current;
    if (!points) return;
    points.position.x = anchorX;
    const posAttr = points.geometry.getAttribute('position') as BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += dt * 0.05;
      arr[i * 3 + 0] += Math.sin(t * 0.4 + seeds[i]) * dt * 0.02;
      if (arr[i * 3 + 1] > 1.4) {
        arr[i * 3 + 1] = -1.4;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
