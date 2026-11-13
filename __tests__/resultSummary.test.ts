import {applyRound, defaultProfile} from '../src/game/profile';
import {finalScore} from '../src/game/scoring';

function outcome(won: boolean, reason: 'quota' | 'timeout' | 'line') {
  return {
    level: 1,
    won,
    reason,
    breakdown: finalScore({
      catchScore: 800,
      secondsLeft: 10,
      segmentsLeft: 2,
      modifier: 1,
      won,
    }),
    stars: won ? 2 : 0,
    caught: {char: 3, relic: 1},
    bestStreak: 3,
  };
}

describe('result summary', () => {
  it('reports the verdict reason the game uses', () => {
    expect(outcome(true, 'quota').reason).toBe('quota');
    expect(outcome(false, 'timeout').reason).toBe('timeout');
    expect(outcome(false, 'line').reason).toBe('line');
  });

  it('keeps the best score and the best stars across replays', () => {
    const p0 = defaultProfile();
    const first = applyRound(p0, outcome(true, 'quota'));
    const best = first.profile.bestScore['1'];
    const weaker = {...outcome(true, 'quota'), stars: 1};
    weaker.breakdown = {...weaker.breakdown, total: 10};
    const second = applyRound(first.profile, weaker);
    expect(second.profile.bestScore['1']).toBe(best);
    expect(second.profile.stars['1']).toBe(2);
  });

  it('announces a first catch as a new log entry', () => {
    const r = applyRound(defaultProfile(), outcome(true, 'quota'));
    expect(r.unlocks.species).toContain('char');
    expect(r.unlocks.species).toContain('relic');
    const again = applyRound(r.profile, outcome(true, 'quota'));
    expect(again.unlocks.species.length).toBe(0);
  });

  it('a lost run still records the catches', () => {
    const r = applyRound(defaultProfile(), outcome(false, 'line'));
    expect(r.profile.speciesCounts.char).toBe(3);
    expect(r.profile.stars['1']).toBeUndefined();
  });
});
