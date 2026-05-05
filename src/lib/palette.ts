export const palette = {
  void: '#08070b',
  void2: '#14101e',
  ember: '#d76b62',
  rust: '#c25b3f',
  ink: '#f4eee2',
  inkDim: '#a89e8c',
  inkFaint: '#5b5547',
  wheelBase: '#0e1018',
  wheelHi: '#1c1f2c',
  wheelBlue: '#7cc9ff',
  wheelPink: '#ffb7e0',
  wheelGlow: '#ffd6f0',
  phosphor: '#c8e0ff',
  scanline: 'rgba(124, 201, 255, 0.06)',
  bezel: '#1a1828',
  bezelHi: '#2a2638',
} as const;

export type PaletteKey = keyof typeof palette;
