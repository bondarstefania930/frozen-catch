import {makeRunState, quotaComplete, resolveCatch} from '../src/game/resolve';
import {SPECIES} from '../src/game/collection';

const ctx = {surge: false, absorbsPike: false, tierBonus: () => 1};

describe('catching the required species', () => {
  it('fills the quota and scores the full value', () => {
    const state = makeRunState({char: 2}, 3);
    const r = resolveCatch(state, 'char', ctx);
    expect(r.kind).toBe('target');
    expect(r.state.filled.char).toBe(1);
    expect(r.state.catchScore).toBe(SPECIES.char.value);
    expect(r.state.streak).toBe(1);
    expect(quotaComplete(r.state)).toBe(false);
  });

  it('completes the order on the last unit', () => {
    let state = makeRunState({char: 2}, 3);
    state = resolveCatch(state, 'char', ctx).state;
    state = resolveCatch(state, 'char', ctx).state;
    expect(quotaComplete(state)).toBe(true);
  });

  it('pays 40 % for a non-target fish and leaves the streak alone', () => {
    const state = makeRunState({char: 2}, 3);
    const r = resolveCatch(state, 'perch', ctx);
    expect(r.kind).toBe('bycatch');
    expect(r.points).toBe(Math.round(SPECIES.perch.value * 0.4));
    expect(r.state.filled.perch).toBeUndefined();
    expect(r.state.streak).toBe(0);
  });

  it('records every catch in the run log', () => {
    let state = makeRunState({char: 1}, 3);
    state = resolveCatch(state, 'char', ctx).state;
    state = resolveCatch(state, 'perch', ctx).state;
    expect(state.caught.char).toBe(1);
    expect(state.caught.perch).toBe(1);
  });
});
