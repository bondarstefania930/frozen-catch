/* @app-slot:anchor */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, StatusBar, StyleSheet, View } from 'react-native';
import { CollectionScreen, GameScreen, LevelSelectScreen, LoaderScreen, MenuScreen, ProgressScreen, ResultScreen, SettingsScreen } from './AppScreens';
import { useProfile } from './AppUI';
import { LEVEL_COUNT, RoundOutcome, Unlocks } from './GameLogic';
import { COLORS, FADE_SCREEN_MS } from './AppResources';

type Screen =
  | 'loader'
  | 'menu'
  | 'levels'
  | 'game'
  | 'result'
  | 'collection'
  | 'progress'
  | 'settings';

const EMPTY_UNLOCKS: Unlocks = {
  species: [],
  lures: [],
  tiers: [],
  nextLevel: false,
};

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const [activeLevel, setActiveLevel] = useState(1);
  const [attempt, setAttempt] = useState(1);
  const [outcome, setOutcome] = useState<RoundOutcome | null>(null);
  const [unlocks, setUnlocks] = useState<Unlocks>(EMPTY_UNLOCKS);

  const {
    profile,
    commitRound,
    setSettings,
    setSelectedLevel,
    setSelectedLure,
    reset,
  } = useProfile();

  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    fade.setValue(0);
    const anim = Animated.timing(fade, {
      toValue: 1,
      duration: FADE_SCREEN_MS,
      useNativeDriver: true,
    });
    anim.start();
    return () => {
      anim.stop();
    };
  }, [fade, screen]);

  const goMenu = useCallback(() => setScreen('menu'), []);

  const startLevel = useCallback(
    (level: number) => {
      const clamped = Math.max(1, Math.min(LEVEL_COUNT, level));
      setActiveLevel(clamped);
      setSelectedLevel(clamped);
      setAttempt(a => a + 1);
      setScreen('game');
    },
    [setSelectedLevel],
  );

  const handleGameOver = useCallback(
    (result: RoundOutcome) => {
      setOutcome(result);
      setUnlocks(commitRound(result));
      setScreen('result');
    },
    [commitRound],
  );

  useEffect(() => {
    const onBack = () => {
      if (screen === 'loader') {
        return true;
      }
      if (screen === 'menu') {
        return false;
      }
      setScreen('menu');
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => {
      sub.remove();
    };
  }, [screen]);

  let body: React.ReactNode = null;

  if (screen === 'loader') {
    body = <LoaderScreen onDone={goMenu} />;
  } else if (screen === 'menu') {
    body = (
      <MenuScreen
        profile={profile}
        onPlay={() => startLevel(profile.unlockedLevel)}
        onLevels={() => setScreen('levels')}
        onCollection={() => setScreen('collection')}
        onProgress={() => setScreen('progress')}
        onSettings={() => setScreen('settings')}
      />
    );
  } else if (screen === 'levels') {
    body = (
      <LevelSelectScreen
        profile={profile}
        onMenu={goMenu}
        onSelectLevel={setSelectedLevel}
        onSelectLure={setSelectedLure}
        onStart={() => startLevel(profile.selectedLevel)}
      />
    );
  } else if (screen === 'game') {
    body = (
      <GameScreen
        key={activeLevel + '-' + attempt}
        profile={profile}
        level={activeLevel}
        attempt={attempt}
        onGameOver={handleGameOver}
        onMenu={goMenu}
        onRestart={() => startLevel(activeLevel)}
      />
    );
  } else if (screen === 'result' && outcome) {
    body = (
      <ResultScreen
        outcome={outcome}
        unlocks={unlocks}
        onAgain={() => startLevel(outcome.level)}
        onNext={() => startLevel(outcome.level + 1)}
        onCollection={() => setScreen('collection')}
        onMenu={goMenu}
      />
    );
  } else if (screen === 'collection') {
    body = <CollectionScreen profile={profile} onMenu={goMenu} />;
  } else if (screen === 'progress') {
    body = (
      <ProgressScreen
        profile={profile}
        onMenu={goMenu}
        onPlay={() => startLevel(1)}
      />
    );
  } else if (screen === 'settings') {
    body = (
      <SettingsScreen
        profile={profile}
        onMenu={goMenu}
        onChange={setSettings}
        onReset={reset}
      />
    );
  } else {
    body = (
      <MenuScreen
        profile={profile}
        onPlay={() => startLevel(profile.unlockedLevel)}
        onLevels={() => setScreen('levels')}
        onCollection={() => setScreen('collection')}
        onProgress={() => setScreen('progress')}
        onSettings={() => setScreen('settings')}
      />
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.abyss} />
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, {opacity: fade}]}>
        {body}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.abyss},
  fill: {flex: 1},
});

export default App;

/* autopad-begin */
function ayasuyaf(_ledibo: number, _ufiloxesiv: string, _xosarupecil: string): string {
  const ezamuyiqo = 72;
  return ezamuyiqo > 48 ? "nurexag" : "usoz";
}
function ekayozew(): boolean {
  return false;
}
function oqobuval(_eqaveso: string): void {
  const muyeculigok: number = 101;
}
function obuvonemunab(_olokonu: boolean, _ireyivede: number, _ronuqef: number): number { return 140; }
/* autopad-end */
