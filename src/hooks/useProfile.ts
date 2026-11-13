import {useCallback, useEffect, useRef, useState} from 'react';
import {
  Profile,
  RoundOutcome,
  Settings,
  Unlocks,
  applyRound,
  defaultProfile,
} from '../game/profile';
import {clearProfile, loadProfile, saveProfile} from '../game/storage';
import {LureId} from '../game/lures';

export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadProfile()
      .then(p => {
        if (mounted.current) {
          setProfile(p);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted.current) {
          setReady(true);
        }
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  const profileRef = useRef(profile);
  profileRef.current = profile;

  const persist = useCallback((next: Profile) => {
    setProfile(next);
    saveProfile(next);
  }, []);

  const commitRound = useCallback(
    (outcome: RoundOutcome): Unlocks => {
      const result = applyRound(profileRef.current, outcome);
      persist(result.profile);
      return result.unlocks;
    },
    [persist],
  );

  const setSettings = useCallback(
    (patch: Partial<Settings>) => {
      persist({
        ...profileRef.current,
        settings: {...profileRef.current.settings, ...patch},
      });
    },
    [persist],
  );

  const setSelectedLevel = useCallback(
    (level: number) => {
      persist({...profileRef.current, selectedLevel: level});
    },
    [persist],
  );

  const setSelectedLure = useCallback(
    (lure: LureId) => {
      persist({...profileRef.current, selectedLure: lure});
    },
    [persist],
  );

  const reset = useCallback(() => {
    const fresh = defaultProfile();
    setProfile(fresh);
    clearProfile();
    saveProfile(fresh);
  }, []);

  return {
    profile,
    profileRef,
    ready,
    commitRound,
    setSettings,
    setSelectedLevel,
    setSelectedLure,
    reset,
  };
}

export default useProfile;
