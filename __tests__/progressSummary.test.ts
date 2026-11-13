import {
  applyRound,
  bestScoreOverall,
  defaultProfile,
  maxStars,
  speciesDiscovered,
  totalStars,
} from '../src/game/profile';
import {finalScore} from '../src/game/scoring';

const round = {
  level: 1,
  won: true,
  reason: 'quota' as const,
  breakdown: finalScore({
    catchScore: 1200,
    secondsLeft: 12,
    segmentsLeft: 2,
    modifier: 1,
    won: true,
  }),
  stars: 3,
  caught: {char: 4, perch: 1},
  bestStreak: 4,
};

describe('progress summary', () => {
  it('starts completely empty', () => {
    const p = defaultProfile();
    expect(totalStars(p)).toBe(0);
    expect(bestScoreOverall(p)).toBe(0);
    expect(speciesDiscovered(p)).toBe(0);
    expect(p.totalCatch).toBe(0);
    expect(maxStars()).toBe(36);
  });

  it('aggregates every number a tile shows', () => {
    const r = applyRound(defaultProfile(), round);
    expect(totalStars(r.profile)).toBe(3);
    expect(r.profile.totalCatch).toBe(5);
    expect(speciesDiscovered(r.profile)).toBe(2);
    expect(r.profile.bestStreak).toBe(4);
    expect(bestScoreOverall(r.profile)).toBe(round.breakdown.total);
    expect(r.profile.zoneBest.shallow).toBe(round.breakdown.total);
  });

  it('keeps the best streak when a later run is worse', () => {
    const a = applyRound(defaultProfile(), round);
    const b = applyRound(a.profile, {...round, bestStreak: 1});
    expect(b.profile.bestStreak).toBe(4);
  });
});
