import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { useDiscAnchor } from './Disc';
import { useScrollCtx } from '@/hooks/useScroll';
import { GlitchType } from './GlitchType';
import { hero, scenes } from '@/content/scenes';

/**
 * CRT-styled circular screen. Lives in its own non-rotating <group> at the disc's
 * hub world coordinate, so the disc spins around it while the screen stays upright.
 *
 * Content:
 *   - Until disc drop completes (`settled === false`): blank, dim phosphor only.
 *   - After settled, scroll progress < ~1.5%: hero copy.
 *   - Once scrolling: cycles through scenes[0..5] tied to the active scene index.
 */
export function CenterScreen({ settled }: { settled: boolean }) {
  const anchorX = useDiscAnchor();
  const { wheel, scene } = useScrollCtx();
  const [w, setW] = useState(0);
  const [s, setS] = useState(0);

  useEffect(() => {
    setW(wheel.get());
    return wheel.on('change', setW);
  }, [wheel]);
  useEffect(() => {
    setS(scene.get());
    return scene.on('change', setS);
  }, [scene]);

  const onHero = w < 0.015;
  const tag = onHero ? hero.tag : scenes[s]?.tag ?? '';
  const title = onHero ? hero.title : scenes[s]?.title ?? '';
  const body = onHero ? hero.sub : scenes[s]?.body ?? '';

  return (
    <group position={[anchorX, 0.06, 0.18]}>
      <Html
        transform
        sprite
        occlude={false}
        distanceFactor={1.6}
        zIndexRange={[10, 0]}
      >
        <div
          className="crt-screen"
          style={{ opacity: settled ? 1 : 0.35, transition: 'opacity 600ms ease' }}
        >
          <div className="crt-scanlines" />
          <div className="crt-curvature" />
          {settled && (
            <div className="crt-content">
              <GlitchType
                text={tag}
                delay={120}
                wordDelay={45}
                particles={false}
                resetKey={`tag-${onHero ? 'hero' : s}`}
                className="crt-tag"
              />
              <GlitchType
                text={title}
                delay={260}
                wordDelay={70}
                particleCount={5}
                resetKey={`title-${onHero ? 'hero' : s}`}
                className="crt-title"
              />
              <GlitchType
                text={body}
                delay={520}
                wordDelay={55}
                particleCount={3}
                resetKey={`body-${onHero ? 'hero' : s}`}
                className="crt-body"
              />
            </div>
          )}
          <div className="crt-bezel" />
        </div>
      </Html>
    </group>
  );
}
