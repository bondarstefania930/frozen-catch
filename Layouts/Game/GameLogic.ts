/* @app-slot:game */
import { GRAB_RADIUS, IDLE_LINE_LEN, LINE_BONUS_PER_SEGMENT, MARKERS_OFF_SCORE_MOD, MAX_NUDGES, NUDGE_PX, REEL_SPEED, ROUND_SECONDS, SURGE_MULTIPLIER, SWING_MAX_DEG, SWING_SCORE_MOD, SwingSpeed, TIME_BONUS_PER_SECOND, WINDOW_SECONDS } from './AppResources';

// ------ index ------
export const Assets = {
  bgGame: require('./assets/bg_game.png'),
  logo: require('./assets/logo.png'),
  iconHome: require('./assets/icon_home.png'),
  iconPause: require('./assets/icon_pause.png'),
  buttonRect: require('./assets/button_rect.png'),
  buttonRound: require('./assets/button_round.png'),
  sprite1: require('./assets/sprite_1.png'),
  sprite2: require('./assets/sprite_2.png'),
  sprite3: require('./assets/sprite_3.png'),
  sprite4: require('./assets/sprite_4.png'),
  sprite5: require('./assets/sprite_5.png'),
} as const;

export type AssetKey = keyof typeof Assets;
// (bundled: index default was Assets)

// ------ collection ------
export type SpeciesKey = 'char' | 'perch' | 'trout' | 'pike' | 'relic';
export type Tier = 'none' | 'bronze' | 'silver' | 'gold';

export interface Species {
  key: SpeciesKey;
  name: string;
  short: string;
  /** The colour-blind safe letter tag printed under a swimmer. Hazards carry none. */
  tag: string | null;
  value: number;
  hazard: boolean;
  sprite: any;
  accent: string;
  note: string;
}

export const SPECIES: Record<SpeciesKey, Species> = {
  char: {
    key: 'char',
    name: 'ARCTIC CHAR',
    short: 'CHAR',
    tag: 'C',
    value: 120,
    hazard: false,
    sprite: Assets.sprite1,
    accent: '#7BE4D6',
    note: 'KEEPS TO THE SHALLOW SHELF',
  },
  perch: {
    key: 'perch',
    name: 'RUBY PERCH',
    short: 'PERCH',
    tag: 'P',
    value: 180,
    hazard: false,
    sprite: Assets.sprite2,
    accent: '#00A6CB',
    note: 'RUNS THE MIDWATER IN SHOALS',
  },
  trout: {
    key: 'trout',
    name: 'GOLDEN TROUT',
    short: 'TROUT',
    tag: 'G',
    value: 320,
    hazard: false,
    sprite: Assets.sprite3,
    accent: '#F2C14E',
    note: 'ONLY SHOWS IN THE DEEP GLOW',
  },
  pike: {
    key: 'pike',
    name: 'ICE PIKE',
    short: 'PIKE',
    tag: null,
    value: 0,
    hazard: true,
    sprite: Assets.sprite4,
    accent: '#E35D5B',
    note: 'BITES THE LINE AND STEALS A CATCH',
  },
  relic: {
    key: 'relic',
    name: 'LAKE RELIC',
    short: 'RELIC',
    tag: null,
    value: 0,
    hazard: true,
    sprite: Assets.sprite5,
    accent: '#7FA7BC',
    note: 'DEAD WEIGHT — SNAGS AND SLOWS THE REEL',
  },
};

export const SPECIES_ORDER: SpeciesKey[] = [
  'char',
  'perch',
  'trout',
  'pike',
  'relic',
];

export const TIER_THRESHOLDS: Array<[Tier, number]> = [
  ['gold', 25],
  ['silver', 10],
  ['bronze', 1],
];

export const TIER_BONUS: Record<Tier, number> = {
  none: 1,
  bronze: 1,
  silver: 1.05,
  gold: 1.12,
};

export const TIER_LABEL: Record<Tier, string> = {
  none: 'NOT YET ON THE LINE',
  bronze: 'BRONZE · NO BONUS YET',
  silver: 'SILVER · +5 % POINTS',
  gold: 'GOLD · +12 % POINTS',
};

export const TIER_COLOR: Record<Tier, string> = {
  none: '#B8DBE5',
  bronze: '#C98B5B',
  silver: '#9DCEDB',
  gold: '#F2C14E',
};

export function tierOf(count: number): Tier {
  for (let i = 0; i < TIER_THRESHOLDS.length; i++) {
    const [tier, need] = TIER_THRESHOLDS[i];
    if (count >= need) {
      return tier;
    }
  }
  return 'none';
}

export function nextTierTarget(count: number): number {
  if (count >= 25) {
    return 25;
  }
  if (count >= 10) {
    return 25;
  }
  return count >= 1 ? 10 : 1;
}

export function tierBonus(count: number): number {
  return TIER_BONUS[tierOf(count)];
}

export function discoveredCount(counts: Record<string, number>): number {
  let n = 0;
  for (let i = 0; i < SPECIES_ORDER.length; i++) {
    if ((counts[SPECIES_ORDER[i]] || 0) > 0) {
      n += 1;
    }
  }
  return n;
}

// ------ hook ------
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

// ------ levels ------
export type ZoneId = 'shallow' | 'hollow' | 'trench';

export interface Zone {
  id: ZoneId;
  name: string;
  from: number; // 1-based level number
  to: number;
  blurb: string;
}

export const ZONES: Zone[] = [
  {
    id: 'shallow',
    name: 'SHALLOW ICE',
    from: 1,
    to: 4,
    blurb: 'CHAR UNDER A THIN SHELF',
  },
  {
    id: 'hollow',
    name: 'DEEP HOLLOW',
    from: 5,
    to: 8,
    blurb: 'PERCH SHOALS AND THE FIRST PIKE',
  },
  {
    id: 'trench',
    name: 'BLACK TRENCH',
    from: 9,
    to: 12,
    blurb: 'GOLDEN TROUT IN THE DEEP GLOW',
  },
];

export interface LevelDef {
  index: number; // 1-based
  zone: ZoneId;
  name: string;
  quota: Partial<Record<SpeciesKey, number>>;
  spawnIntervalMs: number;
  pikeChance: number; // 0..1, folded into the window weights
  stars: [number, number, number];
}

function quota_levels(
  q: Partial<Record<SpeciesKey, number>>,
): Partial<Record<SpeciesKey, number>> {
  return q;
}

const RAW_levels: Array<[ZoneId, Partial<Record<SpeciesKey, number>>, number, number]> =
  [
    ['shallow', quota_levels({char: 4}), 1500, 0],
    ['shallow', quota_levels({char: 5}), 1430, 0.03],
    ['shallow', quota_levels({char: 4, perch: 1}), 1360, 0.06],
    ['shallow', quota_levels({char: 3, perch: 2}), 1300, 0.08],
    ['hollow', quota_levels({perch: 4}), 1250, 0.12],
    ['hollow', quota_levels({perch: 5}), 1200, 0.14],
    ['hollow', quota_levels({perch: 4, char: 2}), 1150, 0.16],
    ['hollow', quota_levels({perch: 3, trout: 1}), 1100, 0.18],
    ['trench', quota_levels({trout: 2}), 1050, 0.2],
    ['trench', quota_levels({trout: 2, perch: 3}), 1010, 0.23],
    ['trench', quota_levels({trout: 3, perch: 2}), 960, 0.26],
    ['trench', quota_levels({trout: 3, perch: 4}), 900, 0.28],
  ];

const LEVEL_NAMES_levels = [
  'FIRST CUT',
  'THIN SHELF',
  'MORNING DRIFT',
  'CRACKED EDGE',
  'DEEP HOLLOW',
  'COLD SHOAL',
  'BLUE LEDGE',
  'LANTERN DEPTH',
  'BLACK TRENCH',
  'SILENT COLUMN',
  'GLOW RUN',
  'LAST WINDOW',
];

export const LEVELS: LevelDef[] = RAW_levels.map((row, i) => {
  const base = 600 + Math.round(600 * (Math.pow(1.12, i) - 1));
  return {
    index: i + 1,
    zone: row[0],
    name: LEVEL_NAMES_levels[i],
    quota: row[1],
    spawnIntervalMs: row[2],
    pikeChance: row[3],
    stars: [
      base,
      Math.round(base * 1.83),
      Math.round(base * 2.83),
    ] as [number, number, number],
  };
});

export const LEVEL_COUNT = LEVELS.length;

export function getLevel(index: number): LevelDef {
  const clamped = Math.max(1, Math.min(LEVEL_COUNT, Math.round(index)));
  return LEVELS[clamped - 1];
}

export function zoneOf(index: number): Zone {
  const lvl = getLevel(index);
  return ZONES.filter(z => z.id === lvl.zone)[0];
}

export function levelsOfZone(zone: ZoneId): LevelDef[] {
  return LEVELS.filter(l => l.zone === zone);
}

export function quotaTotal(def: LevelDef): number {
  const keys = Object.keys(def.quota) as SpeciesKey[];
  let n = 0;
  for (let i = 0; i < keys.length; i++) {
    n += def.quota[keys[i]] || 0;
  }
  return n;
}

export function quotaLabel(def: LevelDef): string {
  const keys = Object.keys(def.quota) as SpeciesKey[];
  return keys
    .map(k => String(def.quota[k]) + ' ' + k.toUpperCase())
    .join(' · ');
}

// ------ lures ------
export type LureId = 'bare' | 'glow' | 'steel' | 'quick';

export interface Lure {
  id: LureId;
  name: string;
  perk: string;
  starsNeeded: number;
  grabRadius: number;
  reelSpeed: number;
  absorbsPike: boolean;
}

export const LURES: Lure[] = [
  {
    id: 'bare',
    name: 'BARE HOOK',
    perk: 'NO PERK · THE HONEST WAY',
    starsNeeded: 0,
    grabRadius: GRAB_RADIUS,
    reelSpeed: REEL_SPEED,
    absorbsPike: false,
  },
  {
    id: 'glow',
    name: 'GLOW LURE',
    perk: 'GRAB RADIUS 22 TO 34',
    starsNeeded: 6,
    grabRadius: 34,
    reelSpeed: REEL_SPEED,
    absorbsPike: false,
  },
  {
    id: 'steel',
    name: 'STEEL LEADER',
    perk: 'ABSORBS ONE PIKE BITE',
    starsNeeded: 14,
    grabRadius: GRAB_RADIUS,
    reelSpeed: REEL_SPEED,
    absorbsPike: true,
  },
  {
    id: 'quick',
    name: 'QUICK REEL',
    perk: 'REEL 340 TO 460 PX/S',
    starsNeeded: 22,
    grabRadius: GRAB_RADIUS,
    reelSpeed: 460,
    absorbsPike: false,
  },
];

export function getLure(id: LureId): Lure {
  for (let i = 0; i < LURES.length; i++) {
    if (LURES[i].id === id) {
      return LURES[i];
    }
  }
  return LURES[0];
}

export function isLureUnlocked(id: LureId, stars: number): boolean {
  return stars >= getLure(id).starsNeeded;
}

export function unlockedLures(stars: number): Lure[] {
  return LURES.filter(l => stars >= l.starsNeeded);
}

// ------ profile ------
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
    unlockedLevel: clampLevel_profile(raw.unlockedLevel),
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
    selectedLevel: clampLevel_profile(raw.selectedLevel),
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

function clampLevel_profile(n: any): number {
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

// ------ resolve ------
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

function bump_resolve(
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
    caught: bump_resolve(state.caught, key, 1),
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
      next.filled = bump_resolve(next.filled, filledKeys[0], -1);
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
    next.filled = bump_resolve(next.filled, key, 1);
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

// ------ rng ------
export type Rng = () => number;

export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return function next(): number {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed = levelIndex * 7919 ^ attempt * 104729 */
export function runSeed(levelIndex: number, attempt: number): number {
  return ((levelIndex * 7919) ^ (attempt * 104729)) >>> 0;
}

export function randInt(rng: Rng, min: number, max: number): number {
  return min + Math.floor(rng() * (max - min + 1));
}

export function randRange(rng: Rng, min: number, max: number): number {
  return min + rng() * (max - min);
}

export function pickWeighted<T extends string>(
  rng: Rng,
  weights: Array<[T, number]>,
): T {
  let total = 0;
  for (let i = 0; i < weights.length; i++) {
    total += weights[i][1];
  }
  if (total <= 0) {
    return weights[0][0];
  }
  let roll = rng() * total;
  for (let i = 0; i < weights.length; i++) {
    roll -= weights[i][1];
    if (roll <= 0) {
      return weights[i][0];
    }
  }
  return weights[weights.length - 1][0];
}

// ------ scoring ------
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

// ------ spawn ------
export const WINDOW_NAMES = ['SHALLOW SHOAL', 'MIDWATER RUN', 'DEEP GLOW'];
export const WINDOW_COUNT = WINDOW_NAMES.length;

export interface SpawnEvent {
  t: number; // ms from round start
  species: SpeciesKey;
  band: 0 | 1 | 2; // depth band in the water column
  fromLeft: boolean;
  speed: number; // px/s
  windowIndex: number;
}

export interface RunPlan {
  seed: number;
  attempt: number;
  events: SpawnEvent[];
  fallback: boolean;
}

/** Base species mix of each 20 s window, before the level's pike pressure. */
const BASE_WEIGHTS_spawn: Array<Array<[SpeciesKey, number]>> = [
  [
    ['char', 70],
    ['relic', 30],
  ],
  [
    ['char', 35],
    ['perch', 40],
    ['trout', 5],
    ['relic', 10],
  ],
  [
    ['char', 10],
    ['perch', 25],
    ['trout', 35],
    ['relic', 10],
  ],
];

const PIKE_PRESSURE_spawn = [0, 1, 1.6];

export function windowWeights(
  windowIndex: number,
  pikeChance: number,
): Array<[SpeciesKey, number]> {
  const idx = Math.max(0, Math.min(WINDOW_COUNT - 1, windowIndex));
  const list = BASE_WEIGHTS_spawn[idx].map(
    pair => [pair[0], pair[1]] as [SpeciesKey, number],
  );
  const pike = Math.round(pikeChance * 100 * PIKE_PRESSURE_spawn[idx]);
  if (pike > 0) {
    list.push(['pike', pike]);
  }
  return list;
}

export function windowIndexAt(elapsedSeconds: number): number {
  const i = Math.floor(elapsedSeconds / WINDOW_SECONDS);
  return Math.max(0, Math.min(WINDOW_COUNT - 1, i));
}

function bandFor_spawn(rng: Rng, species: SpeciesKey): 0 | 1 | 2 {
  const roll = rng();
  if (species === 'char') {
    return roll < 0.65 ? 0 : 1;
  }
  if (species === 'perch') {
    return roll < 0.6 ? 1 : roll < 0.9 ? 0 : 2;
  }
  if (species === 'trout') {
    return roll < 0.7 ? 2 : 1;
  }
  if (species === 'pike') {
    return roll < 0.5 ? 2 : 1;
  }
  return roll < 0.5 ? 1 : 2;
}

function buildEvents_spawn(rng: Rng, level: LevelDef): SpawnEvent[] {
  const events: SpawnEvent[] = [];
  const totalMs = ROUND_SECONDS * 1000;
  let t = 500;
  while (t < totalMs) {
    const wi = windowIndexAt(t / 1000);
    const species = pickWeighted(rng, windowWeights(wi, level.pikeChance));
    events.push({
      t,
      species,
      band: bandFor_spawn(rng, species),
      fromLeft: rng() < 0.5,
      speed: Math.round(randRange(rng, 70, 130)),
      windowIndex: wi,
    });
    t += Math.round(level.spawnIntervalMs * randRange(rng, 0.78, 1.22));
  }
  return events;
}

/** A plan is only shown once it can actually supply the order twice over. */
export function isSolvable(
  events: SpawnEvent[],
  quota: Partial<Record<SpeciesKey, number>>,
): boolean {
  const keys = Object.keys(quota) as SpeciesKey[];
  for (let i = 0; i < keys.length; i++) {
    const need = quota[keys[i]] || 0;
    let have = 0;
    for (let j = 0; j < events.length; j++) {
      if (events[j].species === keys[i]) {
        have += 1;
      }
    }
    if (have < need * 2) {
      return false;
    }
  }
  return true;
}

/** The guarantee behind the generator, never the game itself. */
export function fallbackEvents(level: LevelDef): SpawnEvent[] {
  const rng = mulberry32(0x5eed);
  const events = buildEvents_spawn(rng, level);
  const keys = Object.keys(level.quota) as SpeciesKey[];
  let t = 800;
  for (let i = 0; i < keys.length; i++) {
    const need = (level.quota[keys[i]] || 0) * 2;
    for (let n = 0; n < need; n++) {
      events.push({
        t,
        species: keys[i],
        band: bandFor_spawn(rng, keys[i]),
        fromLeft: n % 2 === 0,
        speed: 90,
        windowIndex: windowIndexAt(t / 1000),
      });
      t += 1200;
    }
  }
  events.sort((a, b) => a.t - b.t);
  return events;
}

export function generateRun(level: LevelDef, attempt: number): RunPlan {
  for (let i = 0; i < 20; i++) {
    const seed = runSeed(level.index, attempt + i);
    const events = buildEvents_spawn(mulberry32(seed), level);
    if (isSolvable(events, level.quota)) {
      return {seed, attempt, events, fallback: false};
    }
  }
  return {
    seed: runSeed(level.index, attempt),
    attempt,
    events: fallbackEvents(level),
    fallback: true,
  };
}

// ------ storage ------
const KEY_storage = 'frozencatch.profile.v1';

/**
 * Local persistence with an in-memory fallback. The native backend is loaded
 * defensively: if it is not installed the app still boots and plays, it simply
 * stops remembering between launches. No screen touches storage directly.
 */
let backend_storage: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  backend_storage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  backend_storage = null;
}

const memory_storage = new Map<string, string>();

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = backend_storage
      ? await backend_storage.getItem(KEY_storage)
      : memory_storage.get(KEY_storage) || null;
    if (!raw) {
      return defaultProfile();
    }
    return hydrate(JSON.parse(raw));
  } catch (e) {
    return defaultProfile();
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    const raw = JSON.stringify(profile);
    memory_storage.set(KEY_storage, raw);
    if (backend_storage) {
      await backend_storage.setItem(KEY_storage, raw);
    }
  } catch (e) {
    // persistence is best-effort; a failed write never breaks a round
  }
}

export async function clearProfile(): Promise<void> {
  try {
    memory_storage.delete(KEY_storage);
    if (backend_storage) {
      await backend_storage.removeItem(KEY_storage);
    }
  } catch (e) {
    // ignore
  }
}

export function hasNativeBackend(): boolean {
  return backend_storage !== null;
}

/* autopad-begin */
function izodufuqavop(_ucajam: number, _abajuz: string): void {
  const abaxoravuci: boolean = false;
}
function unubixex(_efapivukum: string, _ivikefijat: number): string {
  let xapayik: string = "evipar";
  xapayik = "toleyo";
  return xapayik;
}
function epocukemig(_toveciyape: number): number {
  const najupu = 13;
  return najupu > 10 ? 177 : 2;
}
function iyegasoba(_tovidofaloja: boolean): number {
  return 99;
}
function jufazipu(_difiyupasi: number, _otewowupi: string): string {
  const sosiwama: string = "ejape";
  return sosiwama;
}
function ekegunopow(_fekolazuguci: number, _alicigomeda: boolean): boolean { return true; }
function etiguwi(_eyicevalota: boolean): number {
  const ogayolekace = 27;
  const irisaniyecex: number = 119;
  return irisaniyecex;
}
function fupenanofe(_quzaga: number): string { return "fupa"; }
function iguwiyizade(): string { return "ipar"; }
function canajaniyoqu(_kucuwon: number): void {
  const imudipogifi = 62;
  if (imudipogifi > 44) return;
}
function adicamo(_cibazalu: string, _lonirapidaj: number, _oxudiba: number): boolean {
  return true;
}
function ikafetu(_volovotocaw: number, _osomitidojum: number): string { return "qig"; }
function asalodapol(): number {
  let emexajex: number = 173;
  emexajex = 111;
  return emexajex;
}
function tomuvuyofuk(_zapasaqod: boolean, _otetacom: boolean, _mukuqu: string): void {
  const nagamikab: number = 234;
}
function fitalosu(_canezatuwi: string, _yerici: string): void {}
function difivejoqefo(_patelita: number): void {
  const umovuyo = 99;
  if (umovuyo > 26) return;
}
function riwufu(_josunoka: number, _katayayinob: string, _yinulofonuk: string): boolean {
  let minucelilep: boolean = true;
  minucelilep = false;
  return minucelilep;
}
/* autopad-end */
