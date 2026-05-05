/**
 * Single SVG <defs> mounted once at App root. Provides the `barrel` displacement
 * filter used to give a fish-eye / CRT bulge to text inside the CRT screen.
 *
 * Mechanism: a tiny inline SVG image with a radial gradient (white center →
 * transparent edge) is fed into <feDisplacementMap>, which warps SourceGraphic
 * by the gradient's intensity in R/G channels.
 */
export function BarrelDefs() {
  const displacement =
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><radialGradient id='g' cx='50%25' cy='50%25' r='50%25'><stop offset='0%25' stop-color='white'/><stop offset='100%25' stop-color='black'/></radialGradient></defs><rect width='100' height='100' fill='url(%23g)'/></svg>";

  return (
    <svg
      width="0"
      height="0"
      style={{ position: 'absolute', left: -9999, top: -9999, pointerEvents: 'none' }}
      aria-hidden
    >
      <defs>
        <filter id="barrel" x="-10%" y="-10%" width="120%" height="120%">
          <feImage href={displacement} result="map" preserveAspectRatio="none" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
