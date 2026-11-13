import {
  WINDOW_NAMES,
  generateRun,
  isSolvable,
  windowIndexAt,
  windowWeights,
} from '../src/game/spawn';
import {getLevel} from '../src/game/levels';

describe('timed spawn windows', () => {
  it('advances at 20 s and 40 s', () => {
    expect(windowIndexAt(0)).toBe(0);
    expect(windowIndexAt(19.9)).toBe(0);
    expect(windowIndexAt(20)).toBe(1);
    expect(windowIndexAt(40)).toBe(2);
    expect(windowIndexAt(120)).toBe(2);
    expect(WINDOW_NAMES.length).toBe(3);
  });

  it('switches the species mix between windows', () => {
    const w0 = windowWeights(0, 0.2).map(p => p[0]);
    const w2 = windowWeights(2, 0.2).map(p => p[0]);
    expect(w0).not.toContain('trout');
    expect(w0).not.toContain('pike');
    expect(w2).toContain('trout');
    expect(w2).toContain('pike');
  });

  it('generates a solvable plan for every level', () => {
    for (let i = 1; i <= 12; i++) {
      const def = getLevel(i);
      const plan = generateRun(def, 1);
      expect(plan.events.length).toBeGreaterThan(10);
      expect(isSolvable(plan.events, def.quota)).toBe(true);
    }
  });

  it('two attempts of the same level differ', () => {
    const def = getLevel(3);
    const a = generateRun(def, 1).events;
    const b = generateRun(def, 2).events;
    const sameStart =
      a.length === b.length &&
      a.every((e, i) => e.species === b[i].species && e.t === b[i].t);
    expect(sameStart).toBe(false);
  });
});
