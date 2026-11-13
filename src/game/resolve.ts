import {SpeciesKey, SPECIES} from './collection';
import {streakMultiplier, surgeMultiplier} from './scoring';

export interface RunState {
  need: Partial<Record<SpeciesKey, number>>;
  filled: Partial<Record<SpeciesKey, number>>;
  caught: Partial<Record<SpeciesKey, number>>;
  catchScore: number;
  streak: number;
  bestStreak: number;
  lineSegments: number;
  steelUsed: boolean;
}

export interface ResolveCtx {
  surge: boolean;
  absorbsPike: boolean;
  tierBonus: (key: SpeciesKey) => number;
}

export type ResolveKind = 'target' | 'bycatch' | 'junk' | 'pike';

export interface ResolveResult {
  state: RunState;
  kind: ResolveKind;
  points: number;
  lineLost: boolean;
  slowReel: boolean;
  message: string;
}

export function makeRunState(
  need: Partial<Record<SpeciesKey, number>>,
  segments: number,
): RunState {
  return {
    need: {...need},
    filled: {},
    caught: {},
    catchScore: 0,
    streak: 0,
    bestStreak: 0,
    lineSegments: segments,
    steelUsed: false,
  };
}

export function isTargetSpecies(
  state: RunState,
  key: SpeciesKey,
): boolean {
  return (state.need[key] || 0) > 0;
}

export function quotaComplete(state: RunState): boolean {
  const keys = Object.keys(state.need) as SpeciesKey[];
  for (let i = 0; i < keys.length; i++) {
    if ((state.filled[keys[i]] || 0) < (state.need[keys[i]] || 0)) {
      return false;
    }
  }
  return keys.length > 0;
}

function bump(
  map: Partial<Record<SpeciesKey, number>>,
  key: SpeciesKey,
  by: number,
): Partial<Record<SpeciesKey, number>> {
  const next = {...map};
  next[key] = Math.max(0, (next[key] || 0) + by);
  return next;
}

export function resolveCatch(
  state: RunState,
  key: SpeciesKey,
  ctx: ResolveCtx,
): ResolveResult {
  const species = SPECIES[key];
  const next: RunState = {
    ...state,
    need: {...state.need},
    filled: {...state.filled},
    caught: bump(state.caught, key, 1),
  };

  if (key === 'relic') {
    next.streak = 0;
    next.lineSegments = Math.max(0, state.lineSegments - 1);
    return {
      state: next,
      kind: 'junk',
      points: 0,
      lineLost: true,
      slowReel: true,
      message: 'DEAD WEIGHT · LINE FRAYED',
    };
  }

  if (key === 'pike') {
    next.streak = 0;
    const absorbed = ctx.absorbsPike && !state.steelUsed;
    if (absorbed) {
      next.steelUsed = true;
    } else {
      next.lineSegments = Math.max(0, state.lineSegments - 1);
    }
    const filledKeys = (Object.keys(next.filled) as SpeciesKey[]).filter(
      k => (next.filled[k] || 0) > 0,
    );
    if (filledKeys.length > 0) {
      next.filled = bump(next.filled, filledKeys[0], -1);
    }
    return {
      state: next,
      kind: 'pike',
      points: 0,
      lineLost: !absorbed,
      slowReel: false,
      message: absorbed ? 'STEEL LEADER HELD' : 'PIKE BIT THE LINE',
    };
  }

  const target = isTargetSpecies(state, key);
  const already = next.filled[key] || 0;
  const needed = next.need[key] || 0;

  if (target && already < needed) {
    const streak = state.streak + 1;
    const points = Math.round(
      species.value *
        streakMultiplier(streak) *
        surgeMultiplier(ctx.surge) *
        ctx.tierBonus(key),
    );
    next.streak = streak;
    next.bestStreak = Math.max(state.bestStreak, streak);
    next.filled = bump(next.filled, key, 1);
    next.catchScore = state.catchScore + points;
    return {
      state: next,
      kind: 'target',
      points,
      lineLost: false,
      slowReel: false,
      message: species.short + ' ON THE ICE',
    };
  }

  const points = Math.round(species.value * 0.4);
  next.catchScore = state.catchScore + points;
  return {
    state: next,
    kind: 'bycatch',
    points,
    lineLost: false,
    slowReel: false,
    message: 'BYCATCH · ' + species.short,
  };
}
