import {defaultProfile, hydrate} from '../src/game/profile';
import {clearProfile, loadProfile, saveProfile} from '../src/game/storage';

describe('local persistence', () => {
  it('round-trips a profile through the storage module', async () => {
    const p = defaultProfile();
    p.unlockedLevel = 5;
    p.selectedLure = 'steel';
    p.settings.swing = 'FAST';
    await saveProfile(p);
    const back = await loadProfile();
    expect(back.unlockedLevel).toBe(5);
    expect(back.selectedLure).toBe('steel');
    expect(back.settings.swing).toBe('FAST');
  });

  it('returns a fresh profile after a reset', async () => {
    await clearProfile();
    const back = await loadProfile();
    expect(back.unlockedLevel).toBe(1);
    expect(back.totalCatch).toBe(0);
  });

  it('survives corrupt or partial stored data', () => {
    expect(hydrate(null).unlockedLevel).toBe(1);
    expect(hydrate('nonsense' as any).unlockedLevel).toBe(1);
    expect(hydrate({unlockedLevel: 999}).unlockedLevel).toBe(12);
    expect(hydrate({unlockedLevel: -4}).unlockedLevel).toBe(1);
    expect(hydrate({settings: {}}).settings.swing).toBe('NORMAL');
  });
});
