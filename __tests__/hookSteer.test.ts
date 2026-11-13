import {applyNudge, canNudge, maxNudges} from '../src/game/hook';
import {MAX_NUDGES, NUDGE_PX} from '../src/constants/config';

describe('line nudge steering', () => {
  it('moves the hook and spends a nudge', () => {
    const a = applyNudge(0, 2, 1, 150);
    expect(a.nudgeX).toBe(NUDGE_PX);
    expect(a.nudgesLeft).toBe(1);
    const b = applyNudge(a.nudgeX, a.nudgesLeft, -1, 150);
    expect(b.nudgeX).toBe(0);
    expect(b.nudgesLeft).toBe(0);
  });

  it('refuses a third nudge in one descent', () => {
    const spent = applyNudge(10, 0, 1, 150);
    expect(spent.nudgeX).toBe(10);
    expect(spent.nudgesLeft).toBe(0);
    expect(maxNudges()).toBe(MAX_NUDGES);
  });

  it('clamps inside the column', () => {
    expect(applyNudge(145, 2, 1, 150).nudgeX).toBe(150);
    expect(applyNudge(-145, 2, -1, 150).nudgeX).toBe(-150);
  });

  it('only steers while the hook is descending', () => {
    expect(canNudge('descending', 2)).toBe(true);
    expect(canNudge('idle', 2)).toBe(false);
    expect(canNudge('descending', 0)).toBe(false);
  });
});
