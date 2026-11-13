import {generateRun} from '../src/game/spawn';
import {getLevel} from '../src/game/levels';
import {makeRunState, resolveCatch} from '../src/game/resolve';
import {LINE_SEGMENTS, RESOLVE_MS, ROUND_SECONDS} from '../src/constants/config';

const ctx = {surge: false, absorbsPike: false, tierBonus: () => 1};

describe('pause and restart', () => {
  it('a restart re-seeds the level with a different attempt', () => {
    const def = getLevel(2);
    const first = generateRun(def, 1);
    const second = generateRun(def, 2);
    expect(first.seed).not.toBe(second.seed);
  });

  it('a restart starts from a clean run state', () => {
    let state = makeRunState(getLevel(1).quota, LINE_SEGMENTS);
    state = resolveCatch(state, 'relic', ctx).state;
    expect(state.lineSegments).toBe(LINE_SEGMENTS - 1);
    const fresh = makeRunState(getLevel(1).quota, LINE_SEGMENTS);
    expect(fresh.lineSegments).toBe(LINE_SEGMENTS);
    expect(fresh.catchScore).toBe(0);
    expect(fresh.streak).toBe(0);
  });

  it('keeps the round and the resolve beat inside their budgets', () => {
    expect(ROUND_SECONDS).toBe(60);
    expect(RESOLVE_MS).toBeLessThanOrEqual(600);
  });
});
