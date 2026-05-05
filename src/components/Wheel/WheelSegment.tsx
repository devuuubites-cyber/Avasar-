import { forwardRef, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Color, DoubleSide, type Group, type Mesh } from 'three';
import type { Segment } from '@/content/segments';
import { useMotionListener } from '@/hooks/useMotionListener';
import { useScrollCtx } from '@/hooks/useScrollContext';

type Props = {
  seg: Segment;
  total: number;
  /** outer ring radius */
  rOuter: number;
  /** inner ring radius */
  rInner: number;
};

/**
 * One wheel segment: a thin ring slice (annular wedge), a 3D rim label,
 * and a small accent bar along the outer edge.
 *
 * Segment placement: angle = π (9 o'clock) + index * (2π/total). With negative
 * wheel rotation (clockwise), segment i becomes active when rotation = -i * (2π/total).
 */
export const WheelSegment = forwardRef<Group, Props>(function WheelSegment(
  { seg, total, rOuter, rInner },
  ref,
) {
  const groupRef = useRef<Group | null>(null);
  const wedgeRef = useRef<Mesh | null>(null);
  const accentBarRef = useRef<Mesh | null>(null);

  const { active } = useScrollCtx();
  const activeIdx = useMotionListener(active);
  const isActive = activeIdx === seg.index;

  const a = useMemo(() => Math.PI + (seg.index * (Math.PI * 2)) / total, [seg.index, total]);
  const halfArc = useMemo(() => Math.PI / total, [total]);

  // Pre-build geometry args
  const wedgeArgs: [number, number, number, number, number, number] = useMemo(
    () => [rInner, rOuter, 48, 1, -halfArc + 0.005, halfArc * 2 - 0.01],
    [rInner, rOuter, halfArc],
  );

  // Position label at outer rim along this segment's angle (in segment's local frame:
  // the wedge is centered around angle 0, so the rim mid is at (rOuter * 0.78, 0))
  const labelDist = (rInner + rOuter) * 0.5 + (rOuter - rInner) * 0.18;

  const accentColor = useMemo(() => new Color(seg.accent), [seg.accent]);

  useFrame((_, dt) => {
    if (!groupRef.current) return;
    // Subtle scale boost when active
    const targetScale = isActive ? 1.04 : 1.0;
    const cur = groupRef.current.scale.x;
    const next = cur + (targetScale - cur) * Math.min(1, dt * 6);
    groupRef.current.scale.setScalar(next);
    if (accentBarRef.current) {
      const m: any = accentBarRef.current.material;
      const targetEm = isActive ? 1.6 : 0.45;
      m.emissiveIntensity = m.emissiveIntensity + (targetEm - m.emissiveIntensity) * Math.min(1, dt * 5);
    }
  });

  return (
    <group
      ref={(g) => {
        groupRef.current = g;
        if (typeof ref === 'function') ref(g);
        else if (ref) (ref as { current: Group | null }).current = g;
      }}
      rotation={[0, 0, a]}
    >
      {/* The annular wedge — flat in XY plane */}
      <mesh ref={wedgeRef} position={[0, 0, 0]}>
        <ringGeometry args={wedgeArgs} />
        <meshPhysicalMaterial
          color="#181020"
          metalness={0.78}
          roughness={0.32}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          emissive={accentColor}
          emissiveIntensity={isActive ? 0.3 : 0.05}
          side={DoubleSide}
        />
      </mesh>

      {/* Accent bar along the outer rim of this segment */}
      <mesh
        ref={accentBarRef}
        position={[rOuter * 0.97, 0, 0.018]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <boxGeometry args={[(rOuter - rInner) * 0.06, rOuter * 0.55, 0.02]} />
        <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.45} toneMapped={false} />
      </mesh>

      {/* Rim label — counter-rotate so text reads upright when this segment is at 9 o'clock */}
      <group rotation={[0, 0, -a]} position={[Math.cos(a) * labelDist, Math.sin(a) * labelDist, 0.04]}>
        <Text
          fontSize={0.075}
          color={seg.accent}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.002}
          outlineColor="#020104"
          letterSpacing={0.18}
          maxWidth={2}
        >
          {seg.rim}
        </Text>
        <Text
          fontSize={0.038}
          color="#b9b09f"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.32}
          position={[0, -0.085, 0]}
        >
          {seg.number}
        </Text>
      </group>
    </group>
  );
});
