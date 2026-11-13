import {LEVELS, ZONES, levelsOfZone, quotaLabel, getLevel} from '../src/game/levels';
import {defaultProfile, isLevelUnlocked, isZoneUnlocked} from '../src/game/profile';
import {isLureUnlocked} from '../src/game/lures';

describe('level select', () => {
  it('splits 12 levels into 3 zones of 4', () => {
    expect(ZONES.length).toBe(3);
    ZONES.forEach(z => expect(levelsOfZone(z.id).length).toBe(4));
    expect(LEVELS.length).toBe(12);
  });

  it('refuses a locked tile and a locked zone on a fresh profile', () => {
    const p = defaultProfile();
    expect(isLevelUnlocked(p, 1)).toBe(true);
    expect(isLevelUnlocked(p, 2)).toBe(false);
    expect(isZoneUnlocked(p, ZONES[0].from)).toBe(true);
    expect(isZoneUnlocked(p, ZONES[1].from)).toBe(false);
  });

  it('gates the lures behind stars', () => {
    expect(isLureUnlocked('bare', 0)).toBe(true);
    expect(isLureUnlocked('steel', 13)).toBe(false);
    expect(isLureUnlocked('steel', 14)).toBe(true);
  });

  it('describes every order in words', () => {
    for (let i = 1; i <= 12; i++) {
      const label = quotaLabel(getLevel(i));
      expect(label.length).toBeGreaterThan(3);
      expect(label).toEqual(label.toUpperCase());
    }
  });
});
