import {SPECIES, SPECIES_ORDER} from '../src/game/collection';
import {DEFAULT_SETTINGS, hydrate} from '../src/game/profile';

describe('setting: species tags', () => {
  it('gives every catchable species a unique ASCII letter', () => {
    const tags = SPECIES_ORDER.map(k => SPECIES[k].tag).filter(
      t => t !== null,
    ) as string[];
    expect(tags.length).toBe(3);
    expect(new Set(tags).size).toBe(3);
    tags.forEach(t => {
      expect(t.length).toBe(1);
      expect(t.charCodeAt(0)).toBeLessThan(128);
    });
  });

  it('is on by default and is persisted', () => {
    expect(DEFAULT_SETTINGS.speciesTags).toBe(true);
    expect(hydrate({settings: {speciesTags: false}}).settings.speciesTags).toBe(
      false,
    );
  });

  it('has no score effect', () => {
    const a = hydrate({settings: {speciesTags: true}});
    const b = hydrate({settings: {speciesTags: false}});
    expect(a.settings.swing).toBe(b.settings.swing);
    expect(a.settings.hazardMarkers).toBe(b.settings.hazardMarkers);
  });
});
