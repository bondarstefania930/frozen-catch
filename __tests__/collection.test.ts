import {
  SPECIES,
  SPECIES_ORDER,
  TIER_BONUS,
  discoveredCount,
  nextTierTarget,
  tierBonus,
  tierOf,
} from '../src/game/collection';

describe('ice log', () => {
  it('has one card per contract sprite with a unique name', () => {
    expect(SPECIES_ORDER.length).toBe(5);
    const names = SPECIES_ORDER.map(k => SPECIES[k].name);
    expect(new Set(names).size).toBe(5);
  });

  it('raises the tier at 1 / 10 / 25 catches', () => {
    expect(tierOf(0)).toBe('none');
    expect(tierOf(1)).toBe('bronze');
    expect(tierOf(9)).toBe('bronze');
    expect(tierOf(10)).toBe('silver');
    expect(tierOf(24)).toBe('silver');
    expect(tierOf(25)).toBe('gold');
  });

  it('turns the tier into a points bonus', () => {
    expect(tierBonus(0)).toBe(1);
    expect(tierBonus(10)).toBeCloseTo(1.05, 3);
    expect(tierBonus(25)).toBeCloseTo(1.12, 3);
    expect(TIER_BONUS.gold).toBeGreaterThan(TIER_BONUS.silver);
  });

  it('points at the next tier target', () => {
    expect(nextTierTarget(0)).toBe(1);
    expect(nextTierTarget(3)).toBe(10);
    expect(nextTierTarget(12)).toBe(25);
    expect(nextTierTarget(99)).toBe(25);
  });

  it('counts only species actually landed', () => {
    expect(discoveredCount({})).toBe(0);
    expect(discoveredCount({char: 2, pike: 1})).toBe(2);
    expect(discoveredCount({char: 0})).toBe(0);
  });

  it('only the hazards carry no letter tag', () => {
    expect(SPECIES.char.tag).toBe('C');
    expect(SPECIES.perch.tag).toBe('P');
    expect(SPECIES.trout.tag).toBe('G');
    expect(SPECIES.pike.tag).toBeNull();
    expect(SPECIES.relic.tag).toBeNull();
  });
});
