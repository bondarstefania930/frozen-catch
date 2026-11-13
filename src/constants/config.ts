import {SCREEN_W} from './theme';

/** The loader holds for exactly 8000 ms, driven by one timer. Never shorter. */
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
