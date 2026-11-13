import {SWING_PERIODS, SWING_SCORE_MOD} from '../src/constants/config';
import {settingsModifier} from '../src/game/scoring';
import {swingAngle} from '../src/game/hook';
import {DEFAULT_SETTINGS, defaultProfile, hydrate} from '../src/game/profile';

describe('setting: swing speed', () => {
  it('maps each chip to a pendulum period', () => {
    expect(SWING_PERIODS.CALM).toBe(3000);
    expect(SWING_PERIODS.NORMAL).toBe(2400);
    expect(SWING_PERIODS.FAST).toBe(1800);
  });

  it('a faster swing really swings faster', () => {
    const t = 450;
    const calm = Math.abs(swingAngle(t, SWING_PERIODS.CALM));
    const fast = Math.abs(swingAngle(t, SWING_PERIODS.FAST));
    expect(fast).toBeGreaterThan(calm);
  });

  it('only FAST pays a score bonus', () => {
    expect(SWING_SCORE_MOD.CALM).toBe(1);
    expect(SWING_SCORE_MOD.NORMAL).toBe(1);
    expect(SWING_SCORE_MOD.FAST).toBeCloseTo(1.1, 3);
    expect(settingsModifier('FAST', true)).toBeCloseTo(1.1, 3);
  });

  it('is persisted and defaults to NORMAL', () => {
    expect(DEFAULT_SETTINGS.swing).toBe('NORMAL');
    expect(defaultProfile().settings.swing).toBe('NORMAL');
    expect(hydrate({settings: {swing: 'FAST'}}).settings.swing).toBe('FAST');
  });
});
