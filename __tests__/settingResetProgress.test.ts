import {applyRound, defaultProfile} from '../src/game/profile';
import {clearProfile, loadProfile, saveProfile} from '../src/game/storage';
import {finalScore} from '../src/game/scoring';

const round = {
  level: 1,
  won: true,
  reason: 'quota' as const,
  breakdown: finalScore({
    catchScore: 900,
    secondsLeft: 5,
    segmentsLeft: 1,
    modifier: 1,
    won: true,
  }),
  stars: 2,
  caught: {char: 4},
  bestStreak: 3,
};

describe('setting: reset progress', () => {
  it('wipes the stored profile back to level 1 only', async () => {
    const played = applyRound(defaultProfile(), round).profile;
    await saveProfile(played);
    expect((await loadProfile()).unlockedLevel).toBe(2);

    await clearProfile();
    const fresh = await loadProfile();
    expect(fresh.unlockedLevel).toBe(1);
    expect(fresh.totalCatch).toBe(0);
    expect(Object.keys(fresh.stars).length).toBe(0);
    expect(fresh.selectedLure).toBe('bare');
  });

  it('a single tap changes nothing — the wipe needs the second one', () => {
    const played = applyRound(defaultProfile(), round).profile;
    const armedOnly = played;
    expect(armedOnly.unlockedLevel).toBe(2);
    expect(armedOnly.totalCatch).toBe(4);
  });
});
