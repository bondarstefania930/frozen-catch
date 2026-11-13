import {surgeMultiplier} from '../src/game/scoring';
import {makeRunState, resolveCatch} from '../src/game/resolve';
import {SPECIES} from '../src/game/collection';
import {SURGE_MS, SURGE_MULTIPLIER} from '../src/constants/config';

describe('aurora surge', () => {
  it('doubles target points while it burns', () => {
    expect(surgeMultiplier(true)).toBe(SURGE_MULTIPLIER);
    expect(surgeMultiplier(false)).toBe(1);
    const state = makeRunState({trout: 2}, 3);
    const normal = resolveCatch(state, 'trout', {
      surge: false,
      absorbsPike: false,
      tierBonus: () => 1,
    });
    const surged = resolveCatch(state, 'trout', {
      surge: true,
      absorbsPike: false,
      tierBonus: () => 1,
    });
    expect(normal.points).toBe(SPECIES.trout.value);
    expect(surged.points).toBe(SPECIES.trout.value * 2);
  });

  it('lasts eight seconds', () => {
    expect(SURGE_MS).toBe(8000);
  });
});
