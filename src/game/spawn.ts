import {SpeciesKey} from './collection';
import {LevelDef} from './levels';
import {mulberry32, pickWeighted, randRange, runSeed, Rng} from './rng';
import {ROUND_SECONDS, WINDOW_SECONDS} from '../constants/config';

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
const BASE_WEIGHTS: Array<Array<[SpeciesKey, number]>> = [
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

const PIKE_PRESSURE = [0, 1, 1.6];

export function windowWeights(
  windowIndex: number,
  pikeChance: number,
): Array<[SpeciesKey, number]> {
  const idx = Math.max(0, Math.min(WINDOW_COUNT - 1, windowIndex));
  const list = BASE_WEIGHTS[idx].map(
    pair => [pair[0], pair[1]] as [SpeciesKey, number],
  );
  const pike = Math.round(pikeChance * 100 * PIKE_PRESSURE[idx]);
  if (pike > 0) {
    list.push(['pike', pike]);
  }
  return list;
}

export function windowIndexAt(elapsedSeconds: number): number {
  const i = Math.floor(elapsedSeconds / WINDOW_SECONDS);
  return Math.max(0, Math.min(WINDOW_COUNT - 1, i));
}

function bandFor(rng: Rng, species: SpeciesKey): 0 | 1 | 2 {
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

function buildEvents(rng: Rng, level: LevelDef): SpawnEvent[] {
  const events: SpawnEvent[] = [];
  const totalMs = ROUND_SECONDS * 1000;
  let t = 500;
  while (t < totalMs) {
    const wi = windowIndexAt(t / 1000);
    const species = pickWeighted(rng, windowWeights(wi, level.pikeChance));
    events.push({
      t,
      species,
      band: bandFor(rng, species),
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
  const events = buildEvents(rng, level);
  const keys = Object.keys(level.quota) as SpeciesKey[];
  let t = 800;
  for (let i = 0; i < keys.length; i++) {
    const need = (level.quota[keys[i]] || 0) * 2;
    for (let n = 0; n < need; n++) {
      events.push({
        t,
        species: keys[i],
        band: bandFor(rng, keys[i]),
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
    const events = buildEvents(mulberry32(seed), level);
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
