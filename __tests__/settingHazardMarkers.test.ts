import {MARKERS_OFF_SCORE_MOD} from '../src/constants/config';
import {settingsModifier} from '../src/game/scoring';
import {SPECIES} from '../src/game/collection';
import {DEFAULT_SETTINGS, hydrate} from '../src/game/profile';

describe('setting: hazard markers', () => {
  it('marks exactly the two hazards', () => {
    expect(SPECIES.pike.hazard).toBe(true);
    expect(SPECIES.relic.hazard).toBe(true);
    expect(SPECIES.char.hazard).toBe(false);
    expect(SPECIES.perch.hazard).toBe(false);
    expect(SPECIES.trout.hazard).toBe(false);
  });

  it('turning the rings off pays 1.05', () => {
    expect(MARKERS_OFF_SCORE_MOD).toBeCloseTo(1.05, 3);
    expect(settingsModifier('NORMAL', true)).toBe(1);
    expect(settingsModifier('NORMAL', false)).toBeCloseTo(1.05, 3);
  });

  it('is on by default and is persisted', () => {
    expect(DEFAULT_SETTINGS.hazardMarkers).toBe(true);
    expect(hydrate({settings: {hazardMarkers: false}}).settings.hazardMarkers).toBe(
      false,
    );
  });
});
