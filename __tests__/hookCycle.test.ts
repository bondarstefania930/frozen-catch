import {findGrab, hookPoint, swingAngle} from '../src/game/hook';
import {SWING_MAX_DEG} from '../src/constants/config';

describe('hook cycle', () => {
  it('swings symmetrically within the declared arc', () => {
    const period = 2400;
    expect(Math.abs(swingAngle(0, period))).toBeLessThan(0.001);
    expect(swingAngle(period / 4, period)).toBeCloseTo(SWING_MAX_DEG, 3);
    expect(swingAngle((period * 3) / 4, period)).toBeCloseTo(-SWING_MAX_DEG, 3);
  });

  it('hangs straight down at angle 0 and travels further as the line grows', () => {
    const pivot = {x: 100, y: 50};
    const near = hookPoint(pivot, 0, 60, 0);
    const far = hookPoint(pivot, 0, 200, 0);
    expect(near.x).toBeCloseTo(100, 5);
    expect(near.y).toBeCloseTo(110, 5);
    expect(far.y).toBeGreaterThan(near.y);
  });

  it('grabs the nearest entity inside the radius and nothing outside it', () => {
    const hook = {x: 100, y: 100};
    const entities = [
      {id: 1, x: 118, y: 100},
      {id: 2, x: 105, y: 102},
      {id: 3, x: 400, y: 100},
    ];
    expect(findGrab(hook, entities, 22)).toBe(2);
    expect(findGrab({x: 0, y: 0}, entities, 22)).toBeNull();
  });
});
