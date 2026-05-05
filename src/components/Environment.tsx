import { useMemo, useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Color, FogExp2, type InstancedMesh, Matrix4 } from 'three';
import { palette } from '@/lib/palette';

const RACK_COUNT = 64;
const STRIP_COUNT = 12; // horizontal accent strips on the back walls

/**
 * 3D environment behind the wheel: a server-rack corridor receding into
 * volumetric fog. Two columns of vertical racks frame a center vanishing
 * point; the wheel hovers on the right of the screen, so the corridor reads
 * as the negative space on the left.
 */
export function Environment() {
  const racksRef = useRef<InstancedMesh | null>(null);
  const stripsRef = useRef<InstancedMesh | null>(null);
  const accentsRef = useRef<InstancedMesh | null>(null);
  const { scene } = useThree();

  // Heavy cyan-tinted fog so racks deeper than ~12 units fade away
  useEffect(() => {
    const prev = scene.fog;
    scene.fog = new FogExp2(palette.void, 0.085);
    return () => {
      scene.fog = prev;
    };
  }, [scene]);

  const rackMatrices = useMemo(() => {
    const arr: Matrix4[] = [];
    const m = new Matrix4();
    for (let i = 0; i < RACK_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const row = Math.floor(i / 2);
      const z = -1.5 - row * 1.4;
      const x = side * (3.4 + Math.random() * 0.8);
      const y = -0.8 + Math.random() * 0.2;
      const tilt = (Math.random() - 0.5) * 0.06;
      m.makeRotationY(tilt);
      m.setPosition(x, y, z);
      arr.push(m.clone());
    }
    return arr;
  }, []);

  const stripMatrices = useMemo(() => {
    const arr: Matrix4[] = [];
    const m = new Matrix4();
    for (let i = 0; i < STRIP_COUNT; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const row = Math.floor(i / 2);
      const z = -2.5 - row * 2.2;
      const x = side * (3.3 + Math.random() * 0.4);
      const y = 0.3 + Math.random() * 1.4;
      m.makeRotationY(Math.PI / 2);
      m.setPosition(x, y, z);
      arr.push(m.clone());
    }
    return arr;
  }, []);

  // Small emissive panel accents distributed along the racks
  const accentData = useMemo(() => {
    const data: { matrix: Matrix4; isPink: boolean; flicker: number }[] = [];
    const m = new Matrix4();
    for (let i = 0; i < 90; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      const z = -1.5 - Math.random() * 14;
      const x = side * (3.0 + Math.random() * 1.2);
      const y = -1.5 + Math.random() * 3.2;
      m.makeRotationY(side > 0 ? -Math.PI / 2 : Math.PI / 2);
      m.setPosition(x, y, z);
      data.push({
        matrix: m.clone(),
        isPink: Math.random() < 0.45,
        flicker: Math.random() * Math.PI * 2,
      });
    }
    return data;
  }, []);

  useEffect(() => {
    const racks = racksRef.current;
    if (racks) {
      rackMatrices.forEach((m, i) => racks.setMatrixAt(i, m));
      racks.instanceMatrix.needsUpdate = true;
    }
    const strips = stripsRef.current;
    if (strips) {
      stripMatrices.forEach((m, i) => strips.setMatrixAt(i, m));
      strips.instanceMatrix.needsUpdate = true;
    }
    const accents = accentsRef.current;
    if (accents) {
      accentData.forEach((d, i) => accents.setMatrixAt(i, d.matrix));
      accents.instanceMatrix.needsUpdate = true;
    }
  }, [rackMatrices, stripMatrices, accentData]);

  // Subtle accent flicker — modulates per-instance color over time
  useFrame((state) => {
    const accents = accentsRef.current;
    if (!accents) return;
    const t = state.clock.elapsedTime;
    const cyan = new Color(palette.wheelBlue);
    const magenta = new Color(palette.wheelPink);
    const c = new Color();
    accentData.forEach((d, i) => {
      const flick = 0.55 + Math.sin(t * 1.6 + d.flicker) * 0.4;
      c.copy(d.isPink ? magenta : cyan).multiplyScalar(flick);
      accents.setColorAt(i, c);
    });
    if (accents.instanceColor) accents.instanceColor.needsUpdate = true;
  });

  // Floor: subtle reflective dark plane to ground the corridor
  return (
    <group>
      <mesh position={[0, -1.6, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color={palette.void2}
          metalness={0.5}
          roughness={0.85}
        />
      </mesh>

      {/* Server racks — tall thin boxes, dark gunmetal */}
      <instancedMesh ref={racksRef} args={[undefined, undefined, RACK_COUNT]}>
        <boxGeometry args={[0.9, 2.6, 0.55]} />
        <meshStandardMaterial
          color={palette.wheelBase}
          metalness={0.78}
          roughness={0.55}
          emissive={new Color(palette.void2)}
          emissiveIntensity={0.18}
        />
      </instancedMesh>

      {/* Horizontal accent strips along the corridor walls */}
      <instancedMesh ref={stripsRef} args={[undefined, undefined, STRIP_COUNT]}>
        <boxGeometry args={[1.6, 0.04, 0.04]} />
        <meshStandardMaterial
          color={palette.wheelBlue}
          emissive={new Color(palette.wheelBlue)}
          emissiveIntensity={0.85}
          toneMapped={false}
        />
      </instancedMesh>

      {/* Small flickering panel lights embedded in the rack faces */}
      <instancedMesh
        ref={accentsRef}
        args={[undefined, undefined, accentData.length]}
      >
        <planeGeometry args={[0.18, 0.06]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
