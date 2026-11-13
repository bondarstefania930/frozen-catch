import {LEVELS, LEVEL_COUNT, getLevel, quotaTotal, zoneOf} from '../src/game/levels';
import {applyRound, defaultProfile} from '../src/game/profile';
import {finalScore} from '../src/game/scoring';

function win(level: number, total: number, stars: number) {
  return {
    level,
    won: true,
    reason: 'quota' as const,
    breakdown: finalScore({
      catchScore: total,
      secondsLeft: 0,
      segmentsLeft: 0,
      modifier: 1,
      won: true,
    }),
    stars,
    caught: {char: 2},
    bestStreak: 2,
  };
}

describe('difficulty progression', () => {
  it('has 12 levels over 3 zones that tighten', () => {
    expect(LEVEL_COUNT).toBe(12);
    expect(LEVELS[0].spawnIntervalMs).toBeGreaterThan(
      LEVELS[LEVEL_COUNT - 1].spawnIntervalMs,
    );
    expect(LEVELS[0].pikeChance).toBeLessThan(
      LEVELS[LEVEL_COUNT - 1].pikeChance,
    );
    expect(quotaTotal(getLevel(1))).toBeLessThanOrEqual(
      quotaTotal(getLevel(12)),
    );
    expect(zoneOf(1).name).toBe('SHALLOW ICE');
    expect(zoneOf(12).name).toBe('BLACK TRENCH');
  });

  it('opens the next level on a 1-star win and never regresses', () => {
    const p0 = defaultProfile();
    const a = applyRound(p0, win(1, 900, 2));
    expect(a.profile.unlockedLevel).toBe(2);
    expect(a.unlocks.nextLevel).toBe(true);
    const b = applyRound(a.profile, win(1, 100, 1));
    expect(b.profile.unlockedLevel).toBe(2);
    expect(b.profile.stars['1']).toBe(2);
  });

  it('never unlocks past the last level', () => {
    let p = defaultProfile();
    p = {...p, unlockedLevel: LEVEL_COUNT};
    const r = applyRound(p, win(LEVEL_COUNT, 5000, 3));
    expect(r.profile.unlockedLevel).toBe(LEVEL_COUNT);
  });
});
