import {
  LINE_BONUS_PER_SEGMENT,
  MARKERS_OFF_SCORE_MOD,
  SURGE_MULTIPLIER,
  SWING_SCORE_MOD,
  SwingSpeed,
  TIME_BONUS_PER_SECOND,
} from '../constants/config';

export function streakMultiplier(streak: number): number {
  if (streak >= 5) {
    return 3;
  }
  if (streak >= 3) {
    return 2;
  }
  if (streak >= 2) {
    return 1.5;
  }
  return 1;
}

export function surgeMultiplier(active: boolean): number {
  return active ? SURGE_MULTIPLIER : 1;
}

export function settingsModifier(
  swing: SwingSpeed,
  hazardMarkers: boolean,
): number {
  const a = SWING_SCORE_MOD[swing] || 1;
  const b = hazardMarkers ? 1 : MARKERS_OFF_SCORE_MOD;
  return Math.round(a * b * 1000) / 1000;
}

export interface FinalScoreInput {
  catchScore: number;
  secondsLeft: number;
  segmentsLeft: number;
  modifier: number;
  won: boolean;
}

export interface ScoreBreakdown {
  catchScore: number;
  timeBonus: number;
  lineBonus: number;
  modifier: number;
  total: number;
}

export function finalScore(input: FinalScoreInput): ScoreBreakdown {
  const timeBonus = input.won
    ? Math.max(0, Math.round(input.secondsLeft)) * TIME_BONUS_PER_SECOND
    : 0;
  const lineBonus = input.won
    ? Math.max(0, input.segmentsLeft) * LINE_BONUS_PER_SEGMENT
    : 0;
  const total = Math.round(
    (input.catchScore + timeBonus + lineBonus) * input.modifier,
  );
  return {
    catchScore: input.catchScore,
    timeBonus,
    lineBonus,
    modifier: input.modifier,
    total,
  };
}

export function starsFor(
  score: number,
  thresholds: [number, number, number],
  won: boolean,
): number {
  if (!won) {
    return 0;
  }
  if (score >= thresholds[2]) {
    return 3;
  }
  if (score >= thresholds[1]) {
    return 2;
  }
  if (score >= thresholds[0]) {
    return 1;
  }
  return 1;
}

/** Thin-space grouped integers so the count-up never jitters. */
export function formatPoints(n: number): string {
  const v = Math.max(0, Math.round(n));
  return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatClock(seconds: number): string {
  const s = Math.max(0, Math.round(seconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return m + ':' + (r < 10 ? '0' + r : String(r));
}
