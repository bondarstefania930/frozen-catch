import {Dimensions} from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

/**
 * Preset OCEAN_FRESH with exactly two declared accent overrides:
 *   abyss  = #0B2A43  (the under-ice water column needs a dark bottom)
 *   aurora = #7BE4D6  (the northern-lights highlight)
 */
export const COLORS = {
  bg: '#E8F4F8',
  surface: '#D1E7EE',
  surfaceAlt: '#B8DBE5',
  border: '#9DCEDB',
  accent: '#00A6CB',
  accentDeep: '#00558B',
  abyss: '#0B2A43',
  aurora: '#7BE4D6',
  success: '#2FBF91',
  gold: '#F2C14E',
  danger: '#E35D5B',
  textPrimary: '#0B2A43',
  textSecondary: '#3C6B86',
  textMuted: '#7FA7BC',
  textOnDark: '#F2FBFF',
  textOnDarkDim: '#BCDDEC',
  glassLight: 'rgba(255,255,255,0.78)',
  glassLightSoft: 'rgba(255,255,255,0.86)',
  glassDark: 'rgba(11,42,67,0.72)',
  hairlineDark: 'rgba(255,255,255,0.22)',
};

export const GRADIENTS = {
  loader: ['#0B2A43', '#00558B', '#00A6CB'],
  light: ['#E8F4F8', '#D1E7EE'],
  button: ['#00A6CB', '#00558B'],
  water: ['#9DCEDB', '#00A6CB', '#00558B', '#0B2A43'],
  win: ['#0B2A43', '#00558B'],
  lose: ['#0B2A43', '#123044'],
  sheetFade: ['transparent', 'rgba(232,244,248,0.65)', '#E8F4F8'],
  progress: ['#00A6CB', '#7BE4D6'],
};

export const THEME = {
  name: 'OCEAN_FRESH',
  colors: COLORS,
  gradients: GRADIENTS,
};

export const RADIUS = {sm: 12, md: 16, lg: 20, xl: 24, xxl: 28, pill: 999};

export const SPACING = {xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28};

export const HEADER_TOP = 44;

export const TYPE = {
  hero: {fontSize: 42, fontWeight: '800' as const, letterSpacing: 1.5},
  verdict: {fontSize: 34, fontWeight: '800' as const, letterSpacing: 1.2},
  title: {fontSize: 30, fontWeight: '800' as const, letterSpacing: 0.6},
  heading: {fontSize: 17, fontWeight: '700' as const, letterSpacing: 1.2},
  body: {fontSize: 15, fontWeight: '500' as const},
  caption: {fontSize: 11, fontWeight: '600' as const, letterSpacing: 1.4},
  button: {fontSize: 19, fontWeight: '800' as const, lineHeight: 24},
  number: {
    fontSize: 24,
    fontWeight: '800' as const,
    fontVariant: ['tabular-nums'] as const,
  },
};

export const SHADOW = {
  primary: {
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  sheet: {
    shadowColor: COLORS.accentDeep,
    shadowOpacity: 0.14,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: -6},
    elevation: 10,
  },
  card: {
    shadowColor: COLORS.accentDeep,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: {width: 0, height: 4},
    elevation: 4,
  },
  win: {
    shadowColor: COLORS.aurora,
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: {width: 0, height: 6},
    elevation: 8,
  },
};

export const HIT_SLOP = {top: 8, bottom: 8, left: 8, right: 8};

export default THEME;
