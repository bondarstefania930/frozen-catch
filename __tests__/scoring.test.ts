import {
  finalScore,
  formatClock,
  formatPoints,
  settingsModifier,
  starsFor,
} from '../src/game/scoring';
import {
  LINE_BONUS_PER_SEGMENT,
  TIME_BONUS_PER_SECOND,
} from '../src/constants/config';
import {getLevel} from '../src/game/levels';

describe('scoring', () => {
  it('adds the time and line bonuses on a win only', () => {
    const won = finalScore({
      catchScore: 1000,
      secondsLeft: 20,
      segmentsLeft: 2,
      modifier: 1,
      won: true,
    });
    expect(won.timeBonus).toBe(20 * TIME_BONUS_PER_SECOND);
    expect(won.lineBonus).toBe(2 * LINE_BONUS_PER_SEGMENT);
    expect(won.total).toBe(1000 + won.timeBonus + won.lineBonus);

    const lost = finalScore({
      catchScore: 1000,
      secondsLeft: 20,
      segmentsLeft: 2,
      modifier: 1,
      won: false,
    });
    expect(lost.timeBonus).toBe(0);
    expect(lost.lineBonus).toBe(0);
    expect(lost.total).toBe(1000);
  });

  it('applies the settings modifier multiplicatively', () => {
    expect(settingsModifier('NORMAL', true)).toBe(1);
    expect(settingsModifier('FAST', true)).toBeCloseTo(1.1, 3);
    expect(settingsModifier('NORMAL', false)).toBeCloseTo(1.05, 3);
    expect(settingsModifier('FAST', false)).toBeCloseTo(1.155, 3);
  });

  it('awards 1-3 stars on a win and none on a loss', () => {
    const t = getLevel(1).stars;
    expect(starsFor(t[2] + 1, t, true)).toBe(3);
    expect(starsFor(t[1], t, true)).toBe(2);
    expect(starsFor(t[0], t, true)).toBe(1);
    expect(starsFor(0, t, true)).toBe(1);
    expect(starsFor(t[2] + 1, t, false)).toBe(0);
  });

  it('formats numbers and the clock without jitter', () => {
    expect(formatPoints(2410)).toBe('2 410');
    expect(formatPoints(0)).toBe('0');
    expect(formatClock(41)).toBe('0:41');
    expect(formatClock(9)).toBe('0:09');
    expect(formatClock(60)).toBe('1:00');
  });
});
