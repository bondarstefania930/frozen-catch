import {makeRunState, resolveCatch} from '../src/game/resolve';

const bare = {surge: false, absorbsPike: false, tierBonus: () => 1};
const steel = {surge: false, absorbsPike: true, tierBonus: () => 1};

describe('ice pike', () => {
  it('bites the line and steals one filled unit', () => {
    let state = makeRunState({char: 3}, 3);
    state = resolveCatch(state, 'char', bare).state;
    expect(state.filled.char).toBe(1);
    const r = resolveCatch(state, 'pike', bare);
    expect(r.kind).toBe('pike');
    expect(r.state.lineSegments).toBe(2);
    expect(r.state.filled.char).toBe(0);
    expect(r.state.streak).toBe(0);
  });

  it('never pushes the quota below zero', () => {
    const state = makeRunState({char: 3}, 3);
    const r = resolveCatch(state, 'pike', bare);
    expect(r.state.filled.char === undefined || r.state.filled.char >= 0).toBe(
      true,
    );
  });

  it('is absorbed once by the steel leader', () => {
    const state = makeRunState({char: 3}, 3);
    const first = resolveCatch(state, 'pike', steel);
    expect(first.lineLost).toBe(false);
    expect(first.state.lineSegments).toBe(3);
    expect(first.state.steelUsed).toBe(true);
    const second = resolveCatch(first.state, 'pike', steel);
    expect(second.lineLost).toBe(true);
    expect(second.state.lineSegments).toBe(2);
  });
});
