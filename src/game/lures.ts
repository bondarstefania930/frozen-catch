import {GRAB_RADIUS, REEL_SPEED} from '../constants/config';

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
