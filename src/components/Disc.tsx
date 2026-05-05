import { useEffect, useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import { Color, DoubleSide, type Group, type Mesh, MathUtils } from 'three';
import { palette } from '@/lib/palette';
import { useScrollCtx } from '@/hooks/useScroll';

/** World x where the disc center sits, derived from viewport size so 3/4 of the disc is visible on the right. */
export function useDiscAnchor() {
  const { size } = useThree();
  return useMemo(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const halfW = 5 * Math.tan((42 * Math.PI) / 360) * aspect;
    return halfW * 0.5;
  }, [size.width, size.height]);
}

const RADIUS = 1.7;
const DEPTH = 0.16;
/** Each ring inset = [innerR, outerR, zOffset (front-side proud), color] */
const RINGS = [
  { inner: 1.49, outer: 1.55, z: 0.004, color: palette.wheelHi },
  { inner: 1.10, outer: 1.18, z: 0.006, color: palette.wheelHi },
  { inner: 0.72, outer: 0.78, z: 0.008, color: palette.bezelHi },
];

/**
 * Small emissive "windows" embedded on the rings — replicates the reference's
 * dense panel detail. Deterministic so rebuilds stay stable.
 */
const EMBEDDED_PANELS: { angle: number; r: number; w: number; h: number; isPink: boolean }[] = (() => {
  const arr: { angle: number; r: number; w: number; h: number; isPink: boolean }[] = [];
  // Outer ring panels
  const outerR = (RINGS[0].inner + RINGS[0].outer) / 2;
  const outerAngles = [0.18, 0.42, 0.74, 1.06, 1.86, 2.18, 2.62, 2.96, 3.84, 4.22, 4.6, 5.04, 5.48, 5.86];
  outerAngles.forEach((a, i) => {
    arr.push({ angle: a, r: outerR, w: 0.07 + (i % 3) * 0.01, h: 0.022, isPink: i % 3 !== 0 });
  });
  // Mid ring panels (denser, smaller)
  const midR = (RINGS[1].inner + RINGS[1].outer) / 2;
  const midAngles = [
    0.08, 0.32, 0.56, 0.82, 1.16, 1.42, 1.7, 2.0, 2.28, 2.56,
    2.86, 3.16, 3.42, 3.7, 4.0, 4.28, 4.56, 4.84, 5.14, 5.46, 5.78, 6.04,
  ];
  midAngles.forEach((a, i) => {
    arr.push({ angle: a, r: midR, w: 0.05 + (i % 2) * 0.015, h: 0.018, isPink: i % 5 < 2 });
  });
  return arr;
})();

/**
 * 3D disc inspired by the supplied reference: dark gunmetal body, three concentric
 * ring insets, two emissive arcs (one blue, one pink), faint panel seams. No segments.
 *
 * Hierarchy:
 *   groupRef (outer): position anchor + drop entry timeline
 *     innerRef (spin): rotation.z lerped to scroll progress (two revolutions)
 *
 * The disc lies face-on to the camera: body cylinder rotated +π/2 on X so its axis
 * aligns with world Z. Rings, arcs, seams use XY-plane geometries (ring/torus) and
 * are stacked at small +Z offsets to read as inset layers.
 */
export function Disc({ onSettled }: { onSettled?: () => void }) {
  const groupRef = useRef<Group | null>(null);
  const innerRef = useRef<Group | null>(null);
  const hubMeshRef = useRef<Mesh | null>(null);
  const anchorX = useDiscAnchor();
  const { wheel } = useScrollCtx();

  useEffect(() => {
    const g = groupRef.current;
    if (!g) return;
    g.position.y = 5.5;
    g.rotation.x = -0.18;
    g.rotation.z = 0.6;

    const tl = gsap.timeline({
      delay: 0.25,
      onComplete: () => onSettled?.(),
    });
    tl.to(g.position, { y: 0.06, duration: 1.7, ease: 'power3.out' });
    tl.to(g.rotation, { z: 0, duration: 1.7, ease: 'power3.out' }, '<');
    tl.to(g.position, { y: 0, duration: 0.85, ease: 'elastic.out(1, 0.55)' });
    return () => {
      tl.kill();
    };
  }, [onSettled]);

  useFrame((state, dt) => {
    const inner = innerRef.current;
    if (inner) {
      const target = -wheel.get() * Math.PI * 4;
      inner.rotation.z = MathUtils.lerp(inner.rotation.z, target, Math.min(1, dt * 4));
    }
    const g = groupRef.current;
    if (g) g.position.x = anchorX;
    if (hubMeshRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.6) * 0.02;
      hubMeshRef.current.scale.setScalar(s);
    }
  });

  const blue = useMemo(() => new Color(palette.wheelBlue), []);
  const pink = useMemo(() => new Color(palette.wheelPink), []);

  return (
    <group ref={groupRef} position={[anchorX, 0, 0]}>
      <group ref={innerRef}>
        {/* Body cylinder — rotated so its axis points at the camera (face-on disc) */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[RADIUS, RADIUS, DEPTH, 128, 1]} />
          <meshPhysicalMaterial
            color={palette.wheelBase}
            metalness={0.94}
            roughness={0.32}
            clearcoat={0.5}
            clearcoatRoughness={0.4}
          />
        </mesh>

        {/* Rim highlight — torus hugging the front edge */}
        <mesh position={[0, 0, DEPTH / 2 + 0.002]}>
          <torusGeometry args={[RADIUS - 0.012, 0.012, 18, 256]} />
          <meshStandardMaterial
            color={palette.wheelHi}
            metalness={0.9}
            roughness={0.28}
            emissive={blue}
            emissiveIntensity={0.05}
          />
        </mesh>

        {/* Concentric ring insets on the face */}
        {RINGS.map((ring, i) => (
          <mesh key={`ring-${i}`} position={[0, 0, DEPTH / 2 + ring.z]}>
            <ringGeometry args={[ring.inner, ring.outer, 128, 1]} />
            <meshPhysicalMaterial
              color={ring.color}
              metalness={0.88}
              roughness={0.45}
              side={DoubleSide}
            />
          </mesh>
        ))}

        {/* The two emissive arcs — only glow on the disc body */}
        <mesh position={[0, 0, DEPTH / 2 + 0.014]} rotation={[0, 0, Math.PI * 1.18]}>
          <torusGeometry args={[1.14, 0.024, 14, 96, Math.PI * 0.45]} />
          <meshStandardMaterial
            color={blue}
            emissive={blue}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, DEPTH / 2 + 0.014]} rotation={[0, 0, Math.PI * 0.18]}>
          <torusGeometry args={[1.51, 0.02, 14, 96, Math.PI * 0.34]} />
          <meshStandardMaterial
            color={pink}
            emissive={pink}
            emissiveIntensity={2.1}
            toneMapped={false}
          />
        </mesh>

        {/* Panel seams — radial slats on the disc face */}
        {[0.2, 0.95, 1.55, 2.4, 3.1, 3.85, 4.7, 5.55].map((angle, i) => {
          const dist = (RINGS[0].outer + RINGS[1].outer) * 0.5;
          return (
            <mesh
              key={`seam-${i}`}
              position={[Math.cos(angle) * dist, Math.sin(angle) * dist, DEPTH / 2 + 0.005]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.36, 0.006, 0.006]} />
              <meshStandardMaterial color={palette.bezelHi} metalness={0.6} roughness={0.55} />
            </mesh>
          );
        })}

        {/* Embedded panel highlights — small emissive "windows" along the rings (matches reference) */}
        {EMBEDDED_PANELS.map((p, i) => (
          <mesh
            key={`panel-${i}`}
            position={[Math.cos(p.angle) * p.r, Math.sin(p.angle) * p.r, DEPTH / 2 + 0.011]}
            rotation={[0, 0, p.angle + Math.PI / 2]}
          >
            <boxGeometry args={[p.w, p.h, 0.014]} />
            <meshStandardMaterial
              color={p.isPink ? pink : blue}
              emissive={p.isPink ? pink : blue}
              emissiveIntensity={p.isPink ? 1.6 : 1.4}
              toneMapped={false}
            />
          </mesh>
        ))}

        {/* Recessed inner well where the CRT screen sits */}
        <mesh position={[0, 0, DEPTH / 2 + 0.001]}>
          <ringGeometry args={[0.48, 0.62, 96, 1]} />
          <meshStandardMaterial
            color={palette.bezel}
            metalness={0.7}
            roughness={0.45}
            side={DoubleSide}
          />
        </mesh>

        {/* Hub pip — faint pink glow behind the screen */}
        <mesh ref={hubMeshRef} position={[0, 0, DEPTH / 2 + 0.022]}>
          <sphereGeometry args={[0.06, 24, 16]} />
          <meshStandardMaterial
            color={palette.wheelPink}
            emissive={palette.wheelPink}
            emissiveIntensity={1.2}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  );
}
