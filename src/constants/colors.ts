import type { ColorPalette, ColorwayId, GlyphName, ButtonDef } from '../types';

export const DEVICE_PALETTES: Record<ColorwayId, ColorPalette> = {
  butter: { body: '#F0D582', bodyDark: '#C09938', bodyHi: '#FBECBA' },
  mint:   { body: '#B6DFC5', bodyDark: '#74B493', bodyHi: '#DDF1E4' },
  coral:  { body: '#F2A593', bodyDark: '#BE634F', bodyHi: '#FAD0C5' },
  sky:    { body: '#A6C6E4', bodyDark: '#5B8DB7', bodyHi: '#CDDEEF' },
  ube:    { body: '#C9B3D9', bodyDark: '#8472A0', bodyHi: '#E0D2EB' },
};

export const BEZEL = '#B79350';
export const BEZEL_DARK = '#8B6C32';
export const BEZEL_LIGHT = '#D7B770';
export const LCD_BG = '#B0BD78';
export const LCD_BG_DK = '#94A35F';
export const LCD_INK = '#1F2410';
export const LCD_INK_DIM = '#5C6336';

export const GLYPHS: Record<GlyphName, string[]> = {
  heart: ['.##.##.', '#######', '#######', '.#####.', '..###..', '...#...'],
  bolt:  ['..###..', '.##....', '.####..', '..##...', '....##.', '....#..'],
  bowl:  ['#######', '..###..', '#######', '##...##', '##...##', '.#####.'],
  flag:  ['#......', '#####..', '#####..', '#......', '#......', '#......'],
  check: ['......#', '.....#.', '....#..', '#..#...', '##.#...', '.##....', '..#....'],
  pie:   ['..###..', '.#####.', '#.####.', '##.###.', '######.', '.####..', '..#....'],
  dot:   ['.###.', '#####', '#####', '#####', '.###.'],
  zzz:   ['###....', '..#....', '.#.###.', '#....#.', '###.#..', '...#...'],
};

export const BUTTON_DEFINITIONS: ButtonDef[] = [
  { id: 'a', label: 'A', sub: 'add',  color: '#F4A9B8', dark: '#C16678' },
  { id: 'b', label: 'B', sub: 'feed', color: '#86CFC0', dark: '#4D9F8E' },
  { id: 'c', label: 'C', sub: 'form', color: '#B6A8E6', dark: '#7D6FB8' },
];
