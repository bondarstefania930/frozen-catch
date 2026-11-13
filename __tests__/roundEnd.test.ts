import {makeRunState, quotaComplete, resolveCatch} from '../src/game/resolve';
import {LINE_SEGMENTS, ROUND_SECONDS} from '../src/constants/config';
import {finalScore, starsFor} from '../src/game/scoring';
import {getLevel} from '../src/game/levels';

const ctx = {surge: false, absorbsPike: false, tierBonus: () => 1};

describe('round end', () => {
  it('ends in a win when the order is filled', () => {
    let state = makeRunState({char: 2}, LINE_SEGMENTS);
    state = resolveCatch(state, 'char', ctx).state;
    expect(quotaComplete(state)).toBe(false);
    state = resolveCatch(state, 'char', ctx).state;
    expect(quotaComplete(state)).toBe(true);
  });

  it('ends in LINE SNAPPED after three careless catches', () => {
    let state = makeRunState({char: 4}, LINE_SEGMENTS);
    state = resolveCatch(state, 'relic', ctx).state;
    state = resolveCatch(state, 'pike', ctx).state;
    expect(state.lineSegments).toBe(1);
    state = resolveCatch(state, 'relic', ctx).state;
    expect(state.lineSegments).toBe(0);
  });

  it('a 60 s window with nothing done is still a reachable result', () => {
    expect(ROUND_SECONDS).toBe(60);
    const breakdown = finalScore({
      catchScore: 0,
      secondsLeft: 0,
      segmentsLeft: 3,
      modifier: 1,
      won: false,
    });
    expect(breakdown.total).toBe(0);
    expect(starsFor(breakdown.total, getLevel(1).stars, false)).toBe(0);
  });
});
