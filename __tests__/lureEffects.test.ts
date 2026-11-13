import {LURES, getLure, isLureUnlocked, unlockedLures} from '../src/game/lures';
import {GRAB_RADIUS, REEL_SPEED} from '../src/constants/config';

describe('lure loadout', () => {
  it('each lure rewrites one part of the loop', () => {
    expect(getLure('glow').grabRadius).toBeGreaterThan(GRAB_RADIUS);
    expect(getLure('quick').reelSpeed).toBeGreaterThan(REEL_SPEED);
    expect(getLure('steel').absorbsPike).toBe(true);
    expect(getLure('bare').absorbsPike).toBe(false);
  });

  it('is star gated at 6 / 14 / 22', () => {
    expect(getLure('bare').starsNeeded).toBe(0);
    expect(getLure('glow').starsNeeded).toBe(6);
    expect(getLure('steel').starsNeeded).toBe(14);
    expect(getLure('quick').starsNeeded).toBe(22);
    expect(isLureUnlocked('glow', 5)).toBe(false);
    expect(isLureUnlocked('glow', 6)).toBe(true);
    expect(unlockedLures(0).length).toBe(1);
    expect(unlockedLures(22).length).toBe(LURES.length);
  });

  it('falls back to the bare hook for an unknown id', () => {
    expect(getLure('nope' as any).id).toBe('bare');
  });
});
