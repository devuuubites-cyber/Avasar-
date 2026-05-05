import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { Suspense } from 'react';
import { Wheel } from './Wheel';
import { WheelLighting } from './WheelLighting';

export function WheelScene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
      camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 50 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <color attach="background" args={[0, 0, 0]} />
      <Suspense fallback={null}>
        <WheelLighting />
        <Wheel />
        <EffectComposer multisampling={0} enableNormalPass={false}>
          <Bloom
            mipmapBlur
            intensity={0.55}
            luminanceThreshold={0.78}
            luminanceSmoothing={0.18}
          />
          <Vignette eskil={false} offset={0.18} darkness={0.85} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
