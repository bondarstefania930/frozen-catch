import {streakMultiplier} from '../src/game/scoring';
import {makeRunState, resolveCatch} from '../src/game/resolve';
import {SPECIES} from '../src/game/collection';

const ctx = {surge: false, absorbsPike: false, tierBonus: () => 1};

describe('streak multiplier', () => {
  it('climbs 1 / 1.5 / 2 / 3 and caps', () => {
    expect(streakMultiplier(0)).toBe(1);
    expect(streakMultiplier(1)).toBe(1);
    expect(streakMultiplier(2)).toBe(1.5);
    expect(streakMultiplier(3)).toBe(2);
    expect(streakMultiplier(4)).toBe(2);
    expect(streakMultiplier(5)).toBe(3);
    expect(streakMultiplier(50)).toBe(3);
  });

  it('multiplies the points of a chained catch', () => {
    let state = makeRunState({char: 5}, 3);
    const first = resolveCatch(state, 'char', ctx);
    expect(first.points).toBe(SPECIES.char.value);
    const second = resolveCatch(first.state, 'char', ctx);
    expect(second.points).toBe(Math.round(SPECIES.char.value * 1.5));
    const third = resolveCatch(second.state, 'char', ctx);
    expect(third.points).toBe(SPECIES.char.value * 2);
  });

  it('is reset by any hazard and remembered as the best', () => {
    let state = makeRunState({char: 5}, 3);
    state = resolveCatch(state, 'char', ctx).state;
    state = resolveCatch(state, 'char', ctx).state;
    expect(state.bestStreak).toBe(2);
    state = resolveCatch(state, 'relic', ctx).state;
    expect(state.streak).toBe(0);
    expect(state.bestStreak).toBe(2);
  });
});
