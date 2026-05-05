import { palette } from '@/lib/palette';

/**
 * Static dusk backdrop built from layered radial gradients sampled from
 * Video.mp4's keyframes. No <video> element — pure CSS.
 */
export function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 80% 70% at 70% 35%, ${palette.void2} 0%, ${palette.void} 70%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 25% 80%, ${palette.ember}26 0%, transparent 55%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 50% 70% at 95% 50%, ${palette.wheelPink}14 0%, transparent 50%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 40% 30% at 50% 110%, ${palette.rust}1a 0%, transparent 60%)`,
        }}
      />
      <div className="grain absolute inset-0" />
    </div>
  );
}
