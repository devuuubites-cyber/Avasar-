import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, type Group, type Mesh, type MeshStandardMaterial } from 'three';
import { segments } from '@/content/segments';
import { useScrollCtx, WHEEL_END, MORPH_END } from '@/hooks/useScrollContext';
import { useAudio } from '@/hooks/useAudio';
import { useMotionListener } from '@/hooks/useMotionListener';
import { WheelSegment } from './WheelSegment';

const SEG_COUNT = 12;

export function Wheel() {
  const groupRef = useRef<Group>(null);
  const hubRef = useRef<Mesh>(null);
  const innerRingRef = useRef<Mesh>(null);
  const outerRimRef = useRef<Mesh>(null);
  const { wheel, morph, velocity, active } = useScrollCtx();
  const audio = useAudio();
  const lastActiveRef = useRef(0);
  const lastTickTimeRef = useRef(0);
  const boomedRef = useRef(false);
  const { size } = useThree();

  // Wheel size — anchored offscreen right, leftmost arc reaches x ≈ 0
  const rOuter = 1.65;
  const rInner = 0.45;

  // Anchor the wheel center off the right edge based on viewport aspect
  // so the leftmost arc lands ~25% across the visible viewport.
  const anchorX = useMemo(() => {
    const aspect = size.width / size.height;
    // World-units half-width at z=0 with default 50° FOV camera at z≈5
    // half-width = z * tan(fov/2) * aspect ≈ 5 * 0.4663 * aspect
    const halfW = 5 * Math.tan((50 * Math.PI) / 360) * aspect;
    // Place wheel center at +0.55 of half-width (so leftmost arc is at -1.1*halfW + rOuter*… ) — empirically pleasant
    return halfW * 0.42 + rOuter * 0.4;
  }, [size.width, size.height]);

  const activeIdx = useMotionListener(active);

  // Tick on segment change
  useEffect(() => {
    if (lastActiveRef.current !== activeIdx) {
      // Avoid double-fire on initial mount
      const now = performance.now();
      if (now - lastTickTimeRef.current > 80) {
        audio.tick();
        lastTickTimeRef.current = now;
      }
      lastActiveRef.current = activeIdx;
    }
  }, [activeIdx, audio]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    const w = wheel.get();
    const m = morph.get();

    // Target rotation: 0 .. -(SEG_COUNT-1) * 30°
    // wheelProgress 0 → segment 0 active at θ=0
    // wheelProgress 1 → segment 11 active at θ = -11 * (2π/12)
    const targetRot = -w * (SEG_COUNT - 1) * ((Math.PI * 2) / SEG_COUNT);
    // Add a small idle drift — barely perceptible, keeps wheel "alive"
    const idleDrift = -dt * 0.012;
    const cur = groupRef.current.rotation.z;
    // Snap-friendly easing
    const eased = cur + (targetRot - cur) * Math.min(1, dt * 8) + idleDrift;
    groupRef.current.rotation.z = eased;

    // Position offscreen-right; subtle parallax tilt with scroll velocity
    const v = velocity.get();
    groupRef.current.position.x = anchorX + Math.max(-0.06, Math.min(0.06, v / 5000));
    groupRef.current.position.y = 0;

    // Morph: scale wheel down + push it right as morph progresses
    const morphFalloff = 1 - m * 0.85;
    groupRef.current.scale.setScalar(morphFalloff);
    groupRef.current.position.x += m * 1.2;

    // Hub pulse
    if (hubRef.current) {
      const mat = hubRef.current.material as MeshStandardMaterial;
      const t = performance.now() / 1000;
      const base = 1.4 + Math.sin(t * 2.2) * 0.3;
      const morphBoost = 1 + m * 4.5;
      mat.emissiveIntensity = base * morphBoost;
      const sc = 1 + m * 0.6 + Math.sin(t * 4) * 0.02;
      hubRef.current.scale.setScalar(sc);
    }

    // Boom once when morph crosses 0.05
    if (m > 0.05 && !boomedRef.current) {
      audio.boom();
      boomedRef.current = true;
    } else if (m < 0.01 && boomedRef.current) {
      boomedRef.current = false;
    }

    // Whir volume tracks |scroll velocity| during the wheel section
    const inWheel = wheel.get() < 1 && morph.get() < 0.5;
    const whirLevel = inWheel ? Math.max(0, Math.min(1, Math.abs(v) / 1500)) : 0;
    audio.setWhir(whirLevel);
  });

  return (
    <group ref={groupRef} position={[anchorX, 0, 0]}>
      {/* Outer rim — beveled torus */}
      <mesh ref={outerRimRef} position={[0, 0, 0]}>
        <torusGeometry args={[rOuter, 0.06, 24, 128]} />
        <meshPhysicalMaterial
          color="#2a1a3a"
          metalness={0.92}
          roughness={0.22}
          clearcoat={0.85}
          clearcoatRoughness={0.18}
          emissive={new Color('#5b2c8a')}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Inner ring */}
      <mesh ref={innerRingRef}>
        <torusGeometry args={[rInner, 0.025, 16, 96]} />
        <meshPhysicalMaterial
          color="#1b1226"
          metalness={0.7}
          roughness={0.4}
          emissive={new Color('#3a1c5e')}
          emissiveIntensity={0.18}
        />
      </mesh>

      {/* Mid ring — decorative arc */}
      <mesh>
        <torusGeometry args={[(rOuter + rInner) * 0.5, 0.012, 12, 96]} />
        <meshStandardMaterial color="#6c6555" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Hub */}
      <mesh ref={hubRef}>
        <icosahedronGeometry args={[0.16, 1]} />
        <meshStandardMaterial
          color="#ff5cd1"
          emissive="#ff5cd1"
          emissiveIntensity={1.4}
          toneMapped={false}
        />
      </mesh>

      {/* Hub crown — second small sphere */}
      <mesh position={[0, 0, 0.04]}>
        <icosahedronGeometry args={[0.08, 0]} />
        <meshStandardMaterial color="#fdffb7" emissive="#fdffb7" emissiveIntensity={1.8} toneMapped={false} />
      </mesh>

      {/* 12 dividers as thin sticks pointing outward */}
      {Array.from({ length: SEG_COUNT }).map((_, i) => {
        const a = Math.PI + (i * Math.PI * 2) / SEG_COUNT;
        const dist = (rOuter + rInner) * 0.5;
        return (
          <mesh
            key={`div-${i}`}
            position={[Math.cos(a) * dist, Math.sin(a) * dist, 0.025]}
            rotation={[0, 0, a]}
          >
            <boxGeometry args={[rOuter - rInner - 0.05, 0.012, 0.012]} />
            <meshStandardMaterial color="#3d324a" metalness={0.6} roughness={0.5} />
          </mesh>
        );
      })}

      {/* 12 segments */}
      {segments.map((s) => (
        <WheelSegment key={s.index} seg={s} total={SEG_COUNT} rOuter={rOuter} rInner={rInner} />
      ))}
    </group>
  );
}
