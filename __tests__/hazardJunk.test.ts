import {makeRunState, resolveCatch} from '../src/game/resolve';
import {REEL_SPEED, REEL_SPEED_JUNK} from '../src/constants/config';

const ctx = {surge: false, absorbsPike: false, tierBonus: () => 1};

describe('lake relic (junk)', () => {
  it('costs a line segment, resets the streak and pays nothing', () => {
    let state = makeRunState({char: 3}, 3);
    state = resolveCatch(state, 'char', ctx).state;
    expect(state.streak).toBe(1);
    const r = resolveCatch(state, 'relic', ctx);
    expect(r.kind).toBe('junk');
    expect(r.points).toBe(0);
    expect(r.lineLost).toBe(true);
    expect(r.slowReel).toBe(true);
    expect(r.state.lineSegments).toBe(2);
    expect(r.state.streak).toBe(0);
  });

  it('three relics snap the line', () => {
    let state = makeRunState({char: 3}, 3);
    for (let i = 0; i < 3; i++) {
      state = resolveCatch(state, 'relic', ctx).state;
    }
    expect(state.lineSegments).toBe(0);
  });

  it('is heavier than a fish on the reel', () => {
    expect(REEL_SPEED_JUNK).toBeLessThan(REEL_SPEED);
  });
});
