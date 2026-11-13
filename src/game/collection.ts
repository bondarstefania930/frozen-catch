import Assets from '../assets';

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
