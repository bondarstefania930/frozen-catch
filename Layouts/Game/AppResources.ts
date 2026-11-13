/* @app-slot:game */
import { Dimensions } from 'react-native';

const win = Dimensions.get('window');
export const SCREEN_W = win.width;
export const SCREEN_H = win.height;

// ------ config ------
export const LOADER_DURATION_MS = 8000;

export const FADE_SCREEN_MS = 260;
export const FADE_LOADER_OUT_MS = 320;
export const BANNER_MS = 420;
export const BANNER_HOLD_MS = 1400;
export const CATCH_MS = 520;
export const CHIP_POP_MS = 260;
export const AURORA_LOOP_MS = 6000;
export const SCORE_COUNT_MS = 900;

export const SPRING_PRESS = {tension: 160, friction: 12};
export const SPRING_POP = {tension: 150, friction: 11};

/** Board geometry — one source of truth for every screen that draws a grid. */
export const BOARD_MAX_W = Math.min(SCREEN_W - 32, 380);
export const BOARD_FRAME = 12;
export const GRID_GAP = 10;

/** Water column */
export const COLUMN_W = BOARD_MAX_W;
export const ICE_CEILING_H = 56;
export const HOLE_W = 64;
export const IDLE_LINE_LEN = 74;
export const SWING_MAX_DEG = 52;
export const DROP_SPEED = 420; // px/s
export const REEL_SPEED = 340; // px/s
export const REEL_SPEED_JUNK = 170; // px/s
export const GRAB_RADIUS = 22; // px
export const NUDGE_PX = 18;
export const MAX_NUDGES = 2;
export const RESOLVE_MS = 400;

/** Round */
export const ROUND_SECONDS = 60;
export const WINDOW_SECONDS = 20;
export const LINE_SEGMENTS = 3;
export const SURGE_MS = 8000;
export const SURGE_MULTIPLIER = 2;

/** Scoring */
export const TIME_BONUS_PER_SECOND = 20;
export const LINE_BONUS_PER_SEGMENT = 150;

export const SWING_PERIODS = {CALM: 3000, NORMAL: 2400, FAST: 1800} as const;
export type SwingSpeed = keyof typeof SWING_PERIODS;

export const SWING_SCORE_MOD: Record<SwingSpeed, number> = {
  CALM: 1,
  NORMAL: 1,
  FAST: 1.1,
};
export const MARKERS_OFF_SCORE_MOD = 1.05;

/** Tick budget of the game loop (~30 fps state updates). */
export const TICK_MS = 33;

export const PRODUCT_FOOTER =
  'OFFLINE · NO ADS · NO REAL MONEY · FICTIONAL POINTS ONLY';

// ------ theme ------

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

// (bundled: theme default was THEME)

/* autopad-begin */
function zoxediqo(_ifeyeqay: number, _palikeka: string): boolean {
  const ixaboni = 15;
  return ixaboni > 72 ? true : false;
}
function iluguco(_atenecipizu: string, _adameragufex: number, _kamuko: boolean): void {
  const owabaqe: boolean = true;
}
function isewefa(_ivevix: boolean): void {
  const akozupotoy: boolean = true;
}
function qubafe(_gafijuwezem: boolean, _retaduli: boolean, _dukuguzajew: boolean): boolean {
  const caxipena: boolean = false;
  return caxipena;
}
function avatev(_ibukoqubuz: boolean, _fewuwolagiqa: number): boolean {
  const evuzube = 88;
  return evuzube > 69 ? true : true;
}
function caseqawija(_datawon: number, _ecoyeb: string): number { return 241; }
function jeqozut(_uyabilosel: boolean, _exakiqari: string, _ayuqitat: number): void {}
function ninasuq(_unemif: boolean, _layubuj: number): string {
  const ivorareneju = 91;
  const ofadevuyeyo: string = "odizatag";
  return ofadevuyeyo;
}
/* autopad-end */
