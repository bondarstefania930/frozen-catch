import {SpeciesKey} from './collection';

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

function quota(
  q: Partial<Record<SpeciesKey, number>>,
): Partial<Record<SpeciesKey, number>> {
  return q;
}

const RAW: Array<[ZoneId, Partial<Record<SpeciesKey, number>>, number, number]> =
  [
    ['shallow', quota({char: 4}), 1500, 0],
    ['shallow', quota({char: 5}), 1430, 0.03],
    ['shallow', quota({char: 4, perch: 1}), 1360, 0.06],
    ['shallow', quota({char: 3, perch: 2}), 1300, 0.08],
    ['hollow', quota({perch: 4}), 1250, 0.12],
    ['hollow', quota({perch: 5}), 1200, 0.14],
    ['hollow', quota({perch: 4, char: 2}), 1150, 0.16],
    ['hollow', quota({perch: 3, trout: 1}), 1100, 0.18],
    ['trench', quota({trout: 2}), 1050, 0.2],
    ['trench', quota({trout: 2, perch: 3}), 1010, 0.23],
    ['trench', quota({trout: 3, perch: 2}), 960, 0.26],
    ['trench', quota({trout: 3, perch: 4}), 900, 0.28],
  ];

const LEVEL_NAMES = [
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

export const LEVELS: LevelDef[] = RAW.map((row, i) => {
  const base = 600 + Math.round(600 * (Math.pow(1.12, i) - 1));
  return {
    index: i + 1,
    zone: row[0],
    name: LEVEL_NAMES[i],
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
