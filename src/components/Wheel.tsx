import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import { Disc } from './Disc';
import { Dust } from './Dust';
import { CenterScreen } from './CenterScreen';
import { palette } from '@/lib/palette';

export function Wheel() {
  const [settled, setSettled] = useState(false);

  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 42, near: 0.1, far: 50 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.18} color={palette.void2} />
      <directionalLight position={[-3, 2, 4]} intensity={1.4} color={palette.wheelBlue} />
      <directionalLight position={[3, -2, 2]} intensity={1.0} color={palette.wheelPink} />
      <pointLight position={[0, 0, 1.4]} intensity={0.6} color={palette.wheelGlow} distance={4} />

      <Suspense fallback={null}>
        <Disc onSettled={() => setSettled(true)} />
        <Dust />
        <CenterScreen settled={settled} />
      </Suspense>

      <EffectComposer multisampling={0} enableNormalPass={false}>
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.04}
          bokehScale={3.2}
          height={480}
        />
        <Bloom intensity={0.32} luminanceThreshold={0.78} luminanceSmoothing={0.18} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
