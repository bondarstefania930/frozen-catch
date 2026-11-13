import {SpeciesKey, SPECIES_ORDER, tierOf} from './collection';
import {LureId, LURES} from './lures';
import {LEVEL_COUNT, ZoneId, getLevel} from './levels';
import {SwingSpeed} from '../constants/config';
import {ScoreBreakdown} from './scoring';

export interface Settings {
  swing: SwingSpeed;
  hazardMarkers: boolean;
  speciesTags: boolean;
}

export interface Profile {
  unlockedLevel: number;
  stars: Record<string, number>;
  bestScore: Record<string, number>;
  zoneBest: Record<string, number>;
  speciesCounts: Record<string, number>;
  totalCatch: number;
  bestStreak: number;
  selectedLevel: number;
  selectedLure: LureId;
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  swing: 'NORMAL',
  hazardMarkers: true,
  speciesTags: true,
};

export function defaultProfile(): Profile {
  return {
    unlockedLevel: 1,
    stars: {},
    bestScore: {},
    zoneBest: {},
    speciesCounts: {},
    totalCatch: 0,
    bestStreak: 0,
    selectedLevel: 1,
    selectedLure: 'bare',
    settings: {...DEFAULT_SETTINGS},
  };
}

export function hydrate(raw: any): Profile {
  const base = defaultProfile();
  if (!raw || typeof raw !== 'object') {
    return base;
  }
  return {
    unlockedLevel: clampLevel(raw.unlockedLevel),
    stars: typeof raw.stars === 'object' && raw.stars ? raw.stars : {},
    bestScore:
      typeof raw.bestScore === 'object' && raw.bestScore ? raw.bestScore : {},
    zoneBest:
      typeof raw.zoneBest === 'object' && raw.zoneBest ? raw.zoneBest : {},
    speciesCounts:
      typeof raw.speciesCounts === 'object' && raw.speciesCounts
        ? raw.speciesCounts
        : {},
    totalCatch: Number(raw.totalCatch) || 0,
    bestStreak: Number(raw.bestStreak) || 0,
    selectedLevel: clampLevel(raw.selectedLevel),
    selectedLure: (raw.selectedLure as LureId) || 'bare',
    settings: {
      swing: (raw.settings && raw.settings.swing) || DEFAULT_SETTINGS.swing,
      hazardMarkers:
        raw.settings && typeof raw.settings.hazardMarkers === 'boolean'
          ? raw.settings.hazardMarkers
          : DEFAULT_SETTINGS.hazardMarkers,
      speciesTags:
        raw.settings && typeof raw.settings.speciesTags === 'boolean'
          ? raw.settings.speciesTags
          : DEFAULT_SETTINGS.speciesTags,
    },
  };
}

function clampLevel(n: any): number {
  const v = Math.round(Number(n) || 1);
  return Math.max(1, Math.min(LEVEL_COUNT, v));
}

export function totalStars(p: Profile): number {
  let n = 0;
  const keys = Object.keys(p.stars);
  for (let i = 0; i < keys.length; i++) {
    n += p.stars[keys[i]] || 0;
  }
  return n;
}

export function maxStars(): number {
  return LEVEL_COUNT * 3;
}

export function starsOf(p: Profile, level: number): number {
  return p.stars[String(level)] || 0;
}

export function bestOf(p: Profile, level: number): number {
  return p.bestScore[String(level)] || 0;
}

export function bestScoreOverall(p: Profile): number {
  let n = 0;
  const keys = Object.keys(p.bestScore);
  for (let i = 0; i < keys.length; i++) {
    n = Math.max(n, p.bestScore[keys[i]] || 0);
  }
  return n;
}

export function speciesDiscovered(p: Profile): number {
  let n = 0;
  for (let i = 0; i < SPECIES_ORDER.length; i++) {
    if ((p.speciesCounts[SPECIES_ORDER[i]] || 0) > 0) {
      n += 1;
    }
  }
  return n;
}

export function isLevelUnlocked(p: Profile, level: number): boolean {
  return level <= p.unlockedLevel;
}

export function isZoneUnlocked(p: Profile, zoneFrom: number): boolean {
  return p.unlockedLevel >= zoneFrom;
}

export interface RoundOutcome {
  level: number;
  won: boolean;
  reason: 'quota' | 'timeout' | 'line';
  breakdown: ScoreBreakdown;
  stars: number;
  caught: Partial<Record<SpeciesKey, number>>;
  bestStreak: number;
}

export interface Unlocks {
  species: SpeciesKey[];
  lures: LureId[];
  tiers: Array<{species: SpeciesKey; tier: string}>;
  nextLevel: boolean;
}

export function applyRound(
  p: Profile,
  out: RoundOutcome,
): {profile: Profile; unlocks: Unlocks} {
  const next: Profile = {
    ...p,
    stars: {...p.stars},
    bestScore: {...p.bestScore},
    zoneBest: {...p.zoneBest},
    speciesCounts: {...p.speciesCounts},
    settings: {...p.settings},
  };
  const unlocks: Unlocks = {
    species: [],
    lures: [],
    tiers: [],
    nextLevel: false,
  };
  const key = String(out.level);

  const caughtKeys = Object.keys(out.caught) as SpeciesKey[];
  for (let i = 0; i < caughtKeys.length; i++) {
    const k = caughtKeys[i];
    const add = out.caught[k] || 0;
    if (add <= 0) {
      continue;
    }
    const before = next.speciesCounts[k] || 0;
    const after = before + add;
    next.speciesCounts[k] = after;
    next.totalCatch += add;
    if (before === 0) {
      unlocks.species.push(k);
    }
    if (tierOf(after) !== tierOf(before) && tierOf(after) !== 'bronze') {
      unlocks.tiers.push({species: k, tier: tierOf(after)});
    }
  }

  next.bestStreak = Math.max(next.bestStreak, out.bestStreak);
  next.bestScore[key] = Math.max(next.bestScore[key] || 0, out.breakdown.total);

  const zone: ZoneId = getLevel(out.level).zone;
  next.zoneBest[zone] = Math.max(
    next.zoneBest[zone] || 0,
    out.breakdown.total,
  );

  const starsBefore = next.stars[key] || 0;
  if (out.won) {
    next.stars[key] = Math.max(starsBefore, out.stars);
    const open = Math.min(LEVEL_COUNT, out.level + 1);
    if (open > next.unlockedLevel) {
      next.unlockedLevel = open;
      unlocks.nextLevel = true;
    }
  }

  const starsBeforeTotal = totalStars(p);
  const starsAfterTotal = totalStars(next);
  for (let i = 0; i < LURES.length; i++) {
    const l = LURES[i];
    if (l.starsNeeded > 0) {
      if (starsBeforeTotal < l.starsNeeded && starsAfterTotal >= l.starsNeeded) {
        unlocks.lures.push(l.id);
      }
    }
  }

  return {profile: next, unlocks};
}
