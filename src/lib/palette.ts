export const palette = {
  void: '#08070b',
  void2: '#14101e',
  ember: '#d76b62',
  rust: '#c25b3f',
  ink: '#f4eee2',
  inkDim: '#a89e8c',
  inkFaint: '#5b5547',
  wheelBase: '#0a0c14',
  wheelHi: '#1a1d2a',
  wheelBlue: '#3ff0ff',
  wheelPink: '#ff2da0',
  wheelGlow: '#ff6ec7',
  phosphor: '#c8e0ff',
  scanline: 'rgba(124, 201, 255, 0.06)',
  bezel: '#1a1828',
  bezelHi: '#2a2638',
} as const;

export type PaletteKey = keyof typeof palette;
