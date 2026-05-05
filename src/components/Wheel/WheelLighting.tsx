import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { DirectionalLight, PointLight } from 'three';

export function WheelLighting() {
  const keyRef = useRef<DirectionalLight>(null);
  const rimRef = useRef<DirectionalLight>(null);
  const accentRef = useRef<PointLight>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (accentRef.current) {
      accentRef.current.intensity = 6 + Math.sin(t * 1.3) * 1.2;
      accentRef.current.position.x = -0.4 + Math.sin(t * 0.6) * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} color="#3a224f" />
      <hemisphereLight args={['#5d3a86', '#08020c', 0.18]} />
      <directionalLight
        ref={keyRef}
        position={[-2.5, 2.2, 3]}
        intensity={1.6}
        color="#ffe9c2"
      />
      <directionalLight
        ref={rimRef}
        position={[3, -1.5, -2]}
        intensity={1.1}
        color="#6cf6ff"
      />
      <pointLight
        ref={accentRef}
        position={[-0.4, 0, 0.6]}
        intensity={6}
        distance={4}
        color="#ff5cd1"
      />
    </>
  );
}
