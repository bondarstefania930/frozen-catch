import {
  IDLE_LINE_LEN,
  MAX_NUDGES,
  NUDGE_PX,
  SWING_MAX_DEG,
} from '../constants/config';

export type HookState = 'idle' | 'descending' | 'reeling' | 'resolve';

export interface HookVec {
  x: number;
  y: number;
}

export const DEG = Math.PI / 180;

/** The pendulum angle in degrees at time t, measured from straight down. */
export function swingAngle(tMs: number, periodMs: number): number {
  const p = periodMs > 0 ? periodMs : 2400;
  return SWING_MAX_DEG * Math.sin((2 * Math.PI * tMs) / p);
}

/** Hook tip for a line of `length` hanging from `pivot` at `angleDeg`. */
export function hookPoint(
  pivot: HookVec,
  angleDeg: number,
  length: number,
  nudgeX: number,
): HookVec {
  const a = angleDeg * DEG;
  return {
    x: pivot.x + Math.sin(a) * length + nudgeX,
    y: pivot.y + Math.cos(a) * length,
  };
}

export function idleLength(): number {
  return IDLE_LINE_LEN;
}

export function canNudge(state: HookState, nudgesLeft: number): boolean {
  return state === 'descending' && nudgesLeft > 0;
}

export function applyNudge(
  nudgeX: number,
  nudgesLeft: number,
  dir: -1 | 1,
  limit: number,
): {nudgeX: number; nudgesLeft: number} {
  if (nudgesLeft <= 0) {
    return {nudgeX, nudgesLeft};
  }
  const next = Math.max(-limit, Math.min(limit, nudgeX + dir * NUDGE_PX));
  return {nudgeX: next, nudgesLeft: nudgesLeft - 1};
}

export function maxNudges(): number {
  return MAX_NUDGES;
}

export interface GrabTarget {
  id: number;
  x: number;
  y: number;
}

/** The first entity whose centre is inside the grab radius. */
export function findGrab(
  hook: HookVec,
  entities: GrabTarget[],
  radius: number,
): number | null {
  const r2 = radius * radius;
  let best: number | null = null;
  let bestD = Number.POSITIVE_INFINITY;
  for (let i = 0; i < entities.length; i++) {
    const e = entities[i];
    const dx = e.x - hook.x;
    const dy = e.y - hook.y;
    const d = dx * dx + dy * dy;
    if (d <= r2 && d < bestD) {
      bestD = d;
      best = e.id;
    }
  }
  return best;
}
