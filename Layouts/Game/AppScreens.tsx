/* @app-slot:game */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { AppHeader, Chip, EmptyState, FISH_H, FISH_W, FishSprite, FloatScore, HookLine, LevelTile, LineGauge, MenuPill, PauseOverlay, PrimaryButton, QuotaChip, RoundIconButton, ScreenShell, SecondaryButton, SpeciesCard, StarStrip, StarsBadge, StatCard, TrackRow, WaterColumn, WindowBanner, useGameLoop, useSwing } from './AppUI';
import { BOARD_FRAME, BOARD_MAX_W, COLORS, COLUMN_W, DROP_SPEED, FADE_SCREEN_MS, GRADIENTS, GRID_GAP, HEADER_TOP, ICE_CEILING_H, IDLE_LINE_LEN, LINE_SEGMENTS, LOADER_DURATION_MS, MAX_NUDGES, PRODUCT_FOOTER, RADIUS, REEL_SPEED_JUNK, RESOLVE_MS, ROUND_SECONDS, SCORE_COUNT_MS, SCREEN_H, SHADOW, SPRING_POP, SURGE_MS, SWING_PERIODS, SwingSpeed, TICK_MS, WINDOW_SECONDS } from './AppResources';
import { LEVELS, LEVEL_COUNT, LURES, LureId, Profile, RoundOutcome, RunState, SPECIES, SPECIES_ORDER, Settings, SpeciesKey, Unlocks, WINDOW_NAMES, ZONES, ZoneId, applyNudge, bestScoreOverall, finalScore, findGrab, formatClock, formatPoints, generateRun, getLevel, getLure, hookPoint, makeRunState, maxStars, quotaComplete, quotaLabel, resolveCatch, settingsModifier, speciesDiscovered, starsFor, starsOf, streakMultiplier, tierBonus, tierOf, totalStars, windowIndexAt } from './GameLogic';
import { Anchor, ArrowDownCircle, BarChart3, BookOpen, Home, LayoutGrid, Play, Settings as LucideSettings, ShieldCheck, SkipForward, Sparkles, Trash2, Zap } from 'lucide-react-native';
import { Assets } from './GameLogic';
import type { IconCmp } from './AppUI';
import LinearGradient from 'react-native-linear-gradient';
import { styles_CollectionScreen, styles_GameScreen, styles_LevelSelectScreen, styles_LoaderScreen, styles_MenuScreen, styles_ProgressScreen, styles_ResultScreen, styles_SettingsScreen } from './AppScreens.styles';

// ------ CollectionScreen ------
interface Props_CollectionScreen {
  profile: Profile;
  onMenu: () => void;
}

const GAP_CollectionScreen = 12;
const CARD_W_CollectionScreen = Math.floor((BOARD_MAX_W - 24 - GAP_CollectionScreen) / 2);

function CollectionScreen_CollectionScreen({profile, onMenu}: Props_CollectionScreen) {
  const discovered = speciesDiscovered(profile);

  const master = useMemo(() => {
    const fish = ['char', 'perch', 'trout'] as const;
    for (let i = 0; i < fish.length; i++) {
      if (tierOf(profile.speciesCounts[fish[i]] || 0) !== 'gold') {
        return false;
      }
    }
    return true;
  }, [profile.speciesCounts]);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="ICE LOG"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={
          <View style={styles_CollectionScreen.count}>
            <Text style={styles_CollectionScreen.countText}>
              {discovered} / {SPECIES_ORDER.length}
            </Text>
          </View>
        }
      />

      <View style={styles_CollectionScreen.body}>
        {master ? (
          <View style={styles_CollectionScreen.ribbon}>
            <Text style={styles_CollectionScreen.ribbonText}>MASTER ANGLER</Text>
          </View>
        ) : (
          <Text style={styles_CollectionScreen.lead} numberOfLines={2}>
            EVERY SPECIES YOU LAND IS LOGGED HERE · 1 / 10 / 25 CATCHES RAISE
            ITS TIER AND ITS POINTS BONUS
          </Text>
        )}

        <View style={styles_CollectionScreen.grid}>
          {SPECIES_ORDER.map(key => (
            <SpeciesCard
              key={key}
              species={key}
              count={profile.speciesCounts[key] || 0}
              width={CARD_W_CollectionScreen}
            />
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}


export { CollectionScreen_CollectionScreen as CollectionScreen };

// ------ GameScreen ------
interface Props_GameScreen {
  profile: Profile;
  level: number;
  attempt: number;
  onGameOver: (outcome: RoundOutcome) => void;
  onMenu: () => void;
  onRestart: () => void;
}

const HEADER_H_GameScreen = HEADER_TOP + 68;
const ORDER_H_GameScreen = 54;
const BANNER_H_GameScreen = 42;
const BAR_H_GameScreen = 92;
const BAR_BOTTOM_GameScreen = 20;
const COLUMN_H_GameScreen = Math.max(
  260,
  SCREEN_H - HEADER_H_GameScreen - ORDER_H_GameScreen - BANNER_H_GameScreen - BAR_H_GameScreen - BAR_BOTTOM_GameScreen - 16,
);
const PIVOT_X_GameScreen = COLUMN_W / 2;
const PIVOT_Y_GameScreen = ICE_CEILING_H - 4;
const MAX_LINE_GameScreen = COLUMN_H_GameScreen - 74 - PIVOT_Y_GameScreen;
const NUDGE_LIMIT_GameScreen = COLUMN_W / 2 - 24;

type HookPhase_GameScreen = 'idle' | 'descending' | 'reeling' | 'resolve';

interface Entity_GameScreen {
  id: number;
  species: SpeciesKey;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  bob: number;
}

interface Floater_GameScreen {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  born: number;
}

interface ViewState_GameScreen {
  entities: Entity_GameScreen[];
  hookX: number;
  hookY: number;
  phase: HookPhase_GameScreen;
  secondsLeft: number;
  windowIndex: number;
  run: RunState;
  nudgesLeft: number;
  surge: boolean;
  floaters: Floater_GameScreen[];
}

function GameScreen_GameScreen({
  profile,
  level,
  attempt,
  onGameOver,
  onMenu,
  onRestart,
}: Props_GameScreen) {
  const def = useMemo(() => getLevel(level), [level]);
  const lure = useMemo(
    () => getLure(profile.selectedLure),
    [profile.selectedLure],
  );
  const plan = useMemo(() => generateRun(def, attempt), [def, attempt]);
  const periodMs = SWING_PERIODS[profile.settings.swing] || 2400;

  const [paused, setPaused] = useState(false);
  const endedRef = useRef(false);

  const world = useRef({
    tMs: 0,
    nextEvent: 0,
    nextId: 1,
    entities: [] as Entity_GameScreen[],
    floaters: [] as Floater_GameScreen[],
    phase: 'idle' as HookPhase_GameScreen,
    lineLen: IDLE_LINE_LEN,
    angle: 0,
    nudgeX: 0,
    nudgesLeft: MAX_NUDGES,
    carried: null as Entity_GameScreen | null,
    reelSpeed: lure.reelSpeed,
    resolveUntil: 0,
    surgeUntil: 0,
    surgeFired: false,
    lastPush: 0,
    lastPhase: 'idle' as HookPhase_GameScreen,
    run: makeRunState(def.quota, LINE_SEGMENTS),
  });

  const getPeriod = useCallback(() => periodMs, [periodMs]);
  const swing = useSwing(getPeriod);

  const hazardFlash = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const [view, setView] = useState<ViewState_GameScreen>(() => ({
    entities: [],
    hookX: PIVOT_X_GameScreen,
    hookY: PIVOT_Y_GameScreen + IDLE_LINE_LEN,
    phase: 'idle',
    secondsLeft: ROUND_SECONDS,
    windowIndex: 0,
    run: world.current.run,
    nudgesLeft: MAX_NUDGES,
    surge: false,
    floaters: [],
  }));

  const bandY = useCallback((band: number) => {
    const usable = COLUMN_H_GameScreen - ICE_CEILING_H - 86;
    return ICE_CEILING_H + usable * (0.2 + band * 0.3) + 20;
  }, []);

  const flashHazard = useCallback(() => {
    hazardFlash.setValue(0);
    Animated.sequence([
      Animated.timing(hazardFlash, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(hazardFlash, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    shake.setValue(0);
    Animated.sequence([
      Animated.timing(shake, {
        toValue: 1,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: -1,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
      Animated.timing(shake, {
        toValue: 0,
        duration: 55,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [hazardFlash, shake]);

  const endRound = useCallback(
    (won: boolean, reason: 'quota' | 'timeout' | 'line') => {
      if (endedRef.current) {
        return;
      }
      endedRef.current = true;
      const w = world.current;
      const secondsLeft = Math.max(0, ROUND_SECONDS - w.tMs / 1000);
      const modifier = settingsModifier(
        profile.settings.swing,
        profile.settings.hazardMarkers,
      );
      const breakdown = finalScore({
        catchScore: w.run.catchScore,
        secondsLeft,
        segmentsLeft: w.run.lineSegments,
        modifier,
        won,
      });
      onGameOver({
        level,
        won,
        reason,
        breakdown,
        stars: starsFor(breakdown.total, def.stars, won),
        caught: w.run.caught,
        bestStreak: w.run.bestStreak,
      });
    },
    [def.stars, level, onGameOver, profile.settings],
  );

  const tick = useCallback(
    (dt: number) => {
      const w = world.current;
      if (endedRef.current) {
        return;
      }
      w.tMs += dt;
      swing.advance(dt);

      const elapsed = w.tMs / 1000;
      const secondsLeft = Math.max(0, ROUND_SECONDS - elapsed);
      const windowIndex = windowIndexAt(elapsed);
      const surge = w.tMs < w.surgeUntil;

      if (!w.surgeFired && windowIndex === 2 && w.run.streak >= 3) {
        w.surgeFired = true;
        w.surgeUntil = w.tMs + SURGE_MS;
      }

      while (
        w.nextEvent < plan.events.length &&
        plan.events[w.nextEvent].t <= w.tMs
      ) {
        const ev = plan.events[w.nextEvent];
        w.nextEvent += 1;
        const copies = surge ? 2 : 1;
        for (let c = 0; c < copies; c++) {
          const y = bandY(ev.band) + (c === 0 ? 0 : 26);
          w.entities.push({
            id: w.nextId++,
            species: ev.species,
            x: ev.fromLeft ? -FISH_W : COLUMN_W + FISH_W,
            y,
            baseY: y,
            vx: ev.fromLeft ? ev.speed : -ev.speed,
            bob: (w.nextId % 10) * 0.6,
          });
        }
      }

      const alive: Entity_GameScreen[] = [];
      for (let i = 0; i < w.entities.length; i++) {
        const e = w.entities[i];
        e.x += (e.vx * dt) / 1000;
        e.bob += dt / 420;
        e.y = e.baseY + Math.sin(e.bob) * 6;
        if (e.x > -FISH_W * 2 && e.x < COLUMN_W + FISH_W * 2) {
          alive.push(e);
        }
      }
      w.entities = alive;

      if (w.phase === 'idle') {
        w.angle = swing.angle();
        w.lineLen = IDLE_LINE_LEN;
        w.nudgeX = 0;
      } else if (w.phase === 'descending') {
        w.lineLen += (DROP_SPEED * dt) / 1000;
        const tipNow = hookPoint(
          {x: PIVOT_X_GameScreen, y: PIVOT_Y_GameScreen},
          w.angle,
          w.lineLen,
          w.nudgeX,
        );
        const hit = findGrab(tipNow, w.entities, lure.grabRadius);
        if (hit !== null) {
          let idx = -1;
          for (let i = 0; i < w.entities.length; i++) {
            if (w.entities[i].id === hit) {
              idx = i;
            }
          }
          if (idx >= 0) {
            w.carried = w.entities[idx];
            w.entities.splice(idx, 1);
            w.reelSpeed =
              w.carried.species === 'relic' ? REEL_SPEED_JUNK : lure.reelSpeed;
            w.phase = 'reeling';
          }
        } else if (w.lineLen >= MAX_LINE_GameScreen) {
          w.carried = null;
          w.reelSpeed = lure.reelSpeed;
          w.phase = 'reeling';
        }
      } else if (w.phase === 'reeling') {
        w.lineLen -= (w.reelSpeed * dt) / 1000;
        if (w.lineLen <= IDLE_LINE_LEN) {
          w.lineLen = IDLE_LINE_LEN;
          const caught = w.carried;
          w.carried = null;
          if (caught) {
            const res = resolveCatch(w.run, caught.species, {
              surge,
              absorbsPike: lure.absorbsPike,
              tierBonus: (k: SpeciesKey) =>
                tierBonus(profile.speciesCounts[k] || 0),
            });
            w.run = res.state;
            const landed = hookPoint(
              {x: PIVOT_X_GameScreen, y: PIVOT_Y_GameScreen},
              w.angle,
              w.lineLen,
              w.nudgeX,
            );
            w.floaters.push({
              id: w.nextId++,
              text:
                res.points > 0 ? '+' + formatPoints(res.points) : res.message,
              x: landed.x,
              y: landed.y,
              color:
                res.kind === 'target'
                  ? COLORS.aurora
                  : res.kind === 'bycatch'
                  ? COLORS.textOnDark
                  : COLORS.danger,
              born: w.tMs,
            });
            if (res.lineLost) {
              flashHazard();
            }
          }
          w.phase = 'resolve';
          w.resolveUntil = w.tMs + RESOLVE_MS;
        }
      } else if (w.phase === 'resolve') {
        if (w.tMs >= w.resolveUntil) {
          w.phase = 'idle';
          w.nudgesLeft = MAX_NUDGES;
          w.nudgeX = 0;
          swing.release();
        }
      }

      const tip = hookPoint(
        {x: PIVOT_X_GameScreen, y: PIVOT_Y_GameScreen},
        w.angle,
        w.lineLen,
        w.nudgeX,
      );

      if (w.carried) {
        w.carried.x = tip.x;
        w.carried.y = tip.y + FISH_H / 2;
      }

      w.floaters = w.floaters.filter(f => w.tMs - f.born < 560);

      const rendered = w.carried ? alive.concat([w.carried]) : alive;

      if (w.tMs - w.lastPush >= TICK_MS || w.phase !== w.lastPhase) {
        w.lastPush = w.tMs;
        w.lastPhase = w.phase;
        setView({
          entities: rendered.slice(0),
          hookX: tip.x,
          hookY: tip.y,
          phase: w.phase,
          secondsLeft: Math.ceil(secondsLeft),
          windowIndex,
          run: w.run,
          nudgesLeft: w.nudgesLeft,
          surge,
          floaters: w.floaters.slice(0),
        });
      }

      if (quotaComplete(w.run)) {
        endRound(true, 'quota');
        return;
      }
      if (w.run.lineSegments <= 0) {
        endRound(false, 'line');
        return;
      }
      if (secondsLeft <= 0) {
        endRound(false, 'timeout');
      }
    },
    [
      bandY,
      endRound,
      flashHazard,
      lure,
      plan.events,
      profile.speciesCounts,
      swing,
    ],
  );

  useGameLoop(!paused, tick);

  const onDrop = useCallback(() => {
    const w = world.current;
    if (w.phase !== 'idle' || paused || endedRef.current) {
      return;
    }
    w.angle = swing.freeze();
    w.nudgeX = 0;
    w.nudgesLeft = MAX_NUDGES;
    w.phase = 'descending';
  }, [paused, swing]);

  const onColumnTap = useCallback((evt: any) => {
    const w = world.current;
    if (w.phase !== 'descending' || w.nudgesLeft <= 0) {
      return;
    }
    const lx =
      evt && evt.nativeEvent && typeof evt.nativeEvent.locationX === 'number'
        ? evt.nativeEvent.locationX
        : PIVOT_X_GameScreen;
    const dir: -1 | 1 = lx < COLUMN_W / 2 ? -1 : 1;
    const next = applyNudge(w.nudgeX, w.nudgesLeft, dir, NUDGE_LIMIT_GameScreen);
    w.nudgeX = next.nudgeX;
    w.nudgesLeft = next.nudgesLeft;
  }, []);

  const quotaKeys = useMemo(
    () => Object.keys(def.quota) as SpeciesKey[],
    [def.quota],
  );

  const elapsedSeconds = ROUND_SECONDS - view.secondsLeft;
  const windowSecondsLeft = Math.max(
    0,
    WINDOW_SECONDS * (view.windowIndex + 1) - elapsedSeconds,
  );

  const shakeX = shake.interpolate({
    inputRange: [-1, 1],
    outputRange: [-4, 4],
  });

  const dropBusy = view.phase !== 'idle';

  return (
    <ScreenShell
      colors={['rgba(11,42,67,0.80)', 'rgba(0,85,139,0.68)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={view.surge ? 0.3 : 0.12}>
      <Animated.View
        pointerEvents="box-none"
        style={{transform: [{translateX: shakeX}]}}>
        <AppHeader
          tone="dark"
          title={'LEVEL ' + def.index}
          leftSlot={
            <RoundIconButton
              source={Assets.iconPause}
              label="PAUSE"
              onPress={() => setPaused(true)}
            />
          }
          rightSlot={
            <LineGauge total={LINE_SEGMENTS} left={view.run.lineSegments} />
          }
        />
      </Animated.View>

      <View style={styles_GameScreen.orderRow}>
        <Text style={styles_GameScreen.orderLabel}>ORDER</Text>
        <View style={styles_GameScreen.orderChips}>
          {quotaKeys.map(k => (
            <QuotaChip
              key={k}
              sprite={SPECIES[k].sprite}
              have={view.run.filled[k] || 0}
              need={def.quota[k] || 0}
            />
          ))}
        </View>
      </View>

      <View style={styles_GameScreen.bannerRow}>
        <WindowBanner
          name={
            view.surge
              ? 'AURORA SURGE x2'
              : WINDOW_NAMES[view.windowIndex] || WINDOW_NAMES[0]
          }
          secondsLeft={Math.ceil(windowSecondsLeft)}
          highlight={view.surge}
        />
      </View>

      <Pressable
        style={styles_GameScreen.columnTouch}
        onPress={onColumnTap}
        accessibilityLabel="STEER THE LINE">
        <WaterColumn
          width={COLUMN_W}
          height={COLUMN_H_GameScreen}
          auroraIntensity={view.surge ? 0.38 : 0.1}
          hazardFlash={hazardFlash}
          hint="TAP DROP TO CAST · TAP LEFT / RIGHT TO STEER THE LINE">
          {view.entities.map(e => (
            <FishSprite
              key={e.id}
              species={e.species}
              x={e.x}
              y={e.y}
              dirRight={e.vx >= 0}
              showTag={profile.settings.speciesTags}
              marked={profile.settings.hazardMarkers}
            />
          ))}
          <HookLine
            width={COLUMN_W}
            height={COLUMN_H_GameScreen}
            pivotX={PIVOT_X_GameScreen}
            pivotY={PIVOT_Y_GameScreen}
            hookX={view.hookX}
            hookY={view.hookY}
            tense={view.phase !== 'idle'}
          />
          {view.floaters.map(f => (
            <FloatScore
              key={f.id}
              text={f.text}
              x={f.x}
              y={f.y}
              color={f.color}
            />
          ))}
        </WaterColumn>
      </Pressable>

      <View style={styles_GameScreen.bar}>
        <View style={styles_GameScreen.barLeft}>
          <Text style={styles_GameScreen.barLabel}>TIME</Text>
          <Text style={styles_GameScreen.clock}>{formatClock(view.secondsLeft)}</Text>
          {view.run.streak >= 2 ? (
            <View style={styles_GameScreen.streakChip}>
              <Text style={styles_GameScreen.streakText}>
                x{streakMultiplier(view.run.streak)} STREAK
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles_GameScreen.barRight}>
          <PrimaryButton
            label={dropBusy ? 'REELING…' : 'DROP'}
            Icon={ArrowDownCircle}
            onPress={onDrop}
            disabled={dropBusy}
            height={62}
          />
          <Text style={styles_GameScreen.nudge}>
            NUDGE {view.nudgesLeft} / {MAX_NUDGES}
          </Text>
        </View>
      </View>

      {paused ? (
        <PauseOverlay
          score={view.run.catchScore}
          orderLine={'LEVEL ' + def.index + ' · ' + quotaLabel(def)}
          secondsLeft={view.secondsLeft}
          onResume={() => setPaused(false)}
          onRestart={onRestart}
          onMenu={onMenu}
        />
      ) : null}
    </ScreenShell>
  );
}


export { GameScreen_GameScreen as GameScreen };

// ------ LevelSelectScreen ------
interface Props_LevelSelectScreen {
  profile: Profile;
  onMenu: () => void;
  onSelectLevel: (level: number) => void;
  onSelectLure: (lure: LureId) => void;
  onStart: () => void;
}

const COLS_LevelSelectScreen = 4;
const TILE_LevelSelectScreen = Math.floor(
  (BOARD_MAX_W - 2 * BOARD_FRAME - GRID_GAP * (COLS_LevelSelectScreen - 1)) / COLS_LevelSelectScreen,
);

const LURE_ICONS_LevelSelectScreen: Record<LureId, IconCmp> = {
  bare: Anchor,
  glow: Sparkles,
  steel: ShieldCheck,
  quick: Zap,
};

function LevelSelectScreen_LevelSelectScreen({
  profile,
  onMenu,
  onSelectLevel,
  onSelectLure,
  onStart,
}: Props_LevelSelectScreen) {
  const stars = totalStars(profile);
  const selected = getLevel(profile.selectedLevel);
  const [zone, setZone] = useState<ZoneId>(selected.zone);
  const [notice, setNotice] = useState<string>('');

  const zoneLevels = useMemo(
    () => LEVELS.filter(l => l.zone === zone),
    [zone],
  );
  const openInZone = zoneLevels.filter(l => l.index <= profile.unlockedLevel);

  const pickZone = useCallback(
    (z: ZoneId) => {
      const first = LEVELS.filter(l => l.zone === z)[0];
      if (first.index > profile.unlockedLevel) {
        setNotice('CLEAR LEVEL ' + (first.index - 1) + ' TO OPEN THIS ZONE');
        return;
      }
      setNotice('');
      setZone(z);
    },
    [profile.unlockedLevel],
  );

  const pickLevel = useCallback(
    (index: number) => {
      if (index > profile.unlockedLevel) {
        setNotice('LEVEL ' + index + ' IS STILL UNDER THICK ICE');
        return;
      }
      setNotice('');
      onSelectLevel(index);
    },
    [onSelectLevel, profile.unlockedLevel],
  );

  const pickLure = useCallback(
    (id: LureId, needed: number) => {
      if (stars < needed) {
        setNotice(needed + ' STARS UNLOCK THIS LURE');
        return;
      }
      setNotice('');
      onSelectLure(id);
    },
    [onSelectLure, stars],
  );

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="LEVEL SELECT"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={<StarsBadge earned={stars} total={maxStars()} />}
      />

      <View style={styles_LevelSelectScreen.body}>
        <View style={styles_LevelSelectScreen.zoneRow}>
          {ZONES.map(z => (
            <Chip
              key={z.id}
              label={z.name}
              active={z.id === zone}
              locked={z.from > profile.unlockedLevel}
              height={40}
              onPress={() => pickZone(z.id)}
            />
          ))}
        </View>

        {openInZone.length === 0 ? (
          <EmptyState
            title="THE ICE HERE IS STILL TOO THICK"
            line="CLEAR THE ZONE BEFORE IT TO CUT A HOLE HERE"
          />
        ) : (
          <View style={styles_LevelSelectScreen.board}>
            <View style={styles_LevelSelectScreen.grid}>
              {zoneLevels.map(l => (
                <LevelTile
                  key={l.index}
                  index={l.index}
                  size={TILE_LevelSelectScreen}
                  stars={starsOf(profile, l.index)}
                  locked={l.index > profile.unlockedLevel}
                  selected={l.index === profile.selectedLevel}
                  onPress={() => pickLevel(l.index)}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles_LevelSelectScreen.sectionTitle}>LURE LOADOUT</Text>
        <View style={styles_LevelSelectScreen.lureGrid}>
          {LURES.map(l => (
            <View key={l.id} style={styles_LevelSelectScreen.lureCell}>
              <Chip
                label={l.name}
                sublabel={
                  stars < l.starsNeeded ? l.starsNeeded + ' STARS' : l.perk
                }
                Icon={LURE_ICONS_LevelSelectScreen[l.id]}
                active={profile.selectedLure === l.id}
                locked={stars < l.starsNeeded}
                height={48}
                onPress={() => pickLure(l.id, l.starsNeeded)}
              />
            </View>
          ))}
        </View>

        <View style={styles_LevelSelectScreen.spacer} />

        <Text style={styles_LevelSelectScreen.hint} numberOfLines={2}>
          {notice
            ? notice
            : 'LEVEL ' +
              selected.index +
              ' · ' +
              selected.name +
              ' · ORDER ' +
              quotaLabel(selected)}
        </Text>
        <PrimaryButton
          label="START LEVEL"
          Icon={Play}
          onPress={onStart}
          height={58}
        />
      </View>
    </ScreenShell>
  );
}


export { LevelSelectScreen_LevelSelectScreen as LevelSelectScreen };

// ------ LoaderScreen ------
interface Props_LoaderScreen {
  onDone: () => void;
}

/**
 * The brand card. It holds for exactly LOADER_DURATION_MS, driven by one
 * timer — no tap to skip, no touch handler, no early exit. It is also the
 * dark screen of the app; Menu is the light one.
 */
function LoaderScreen_LoaderScreen({onDone}: Props_LoaderScreen) {
  const pop = useRef(new Animated.Value(0.82)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleRise = useRef(new Animated.Value(14)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(onDone, LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [onDone]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        tension: SPRING_POP.tension,
        friction: SPRING_POP.friction,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    const title = Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 420,
        delay: 220,
        useNativeDriver: true,
      }),
      Animated.timing(titleRise, {
        toValue: 0,
        duration: 420,
        delay: 220,
        useNativeDriver: true,
      }),
    ]);
    title.start();

    // width is not native-drivable — this one runs on the JS driver by design
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();

    return () => {
      title.stop();
      bar.stop();
    };
  }, [fade, pop, progress, titleFade, titleRise]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });

  return (
    <ScreenShell
      colors={[
        'rgba(11,42,67,0.94)',
        'rgba(0,85,139,0.90)',
        'rgba(0,166,203,0.86)',
      ]}
      auroraIntensity={0.16}>
      <View style={styles_LoaderScreen.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles_LoaderScreen.card,
            {opacity: fade, transform: [{scale: pop}]},
          ]}>
          <Image source={Assets.logo} resizeMode="contain" style={styles_LoaderScreen.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{opacity: titleFade, transform: [{translateY: titleRise}]}}>
          <Text style={styles_LoaderScreen.title}>FROZEN CATCH</Text>
          <Text style={styles_LoaderScreen.subtitle}>ONE HOOK · ONE WINDOW</Text>
        </Animated.View>

        <View style={styles_LoaderScreen.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles_LoaderScreen.barFill, {width: barWidth}]}>
            <LinearGradient
              colors={GRADIENTS.progress}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles_LoaderScreen.barGrad}
              pointerEvents="none"
            />
          </Animated.View>
        </View>
        <Text style={styles_LoaderScreen.loading}>LOADING…</Text>
      </View>
    </ScreenShell>
  );
}


export { LoaderScreen_LoaderScreen as LoaderScreen };

// ------ MenuScreen ------
interface Props_MenuScreen {
  profile: Profile;
  onPlay: () => void;
  onLevels: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

function MenuScreen_MenuScreen({
  profile,
  onPlay,
  onLevels,
  onCollection,
  onProgress,
  onSettings,
}: Props_MenuScreen) {
  const rise = useRef(new Animated.Value(28)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: FADE_SCREEN_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  const stars = totalStars(profile);
  const best = bestScoreOverall(profile);
  const species = speciesDiscovered(profile);
  const nextLevel = getLevel(profile.unlockedLevel);

  const cards = useMemo(() => {
    const list: Array<{key: string; value: string; label: string; color: string}> =
      [
        {
          key: 'levels',
          value: profile.unlockedLevel + ' / ' + LEVEL_COUNT,
          label: 'LEVELS OPEN',
          color: COLORS.accent,
        },
      ];
    if (best > 0) {
      list.push({
        key: 'best',
        value: formatPoints(best),
        label: 'BEST SCORE',
        color: COLORS.gold,
      });
    }
    if (species > 0) {
      list.push({
        key: 'species',
        value: species + ' / ' + SPECIES_ORDER.length,
        label: 'SPECIES LOGGED',
        color: COLORS.success,
      });
    }
    return list.slice(0, 3);
  }, [best, profile.unlockedLevel, species]);

  return (
    <ScreenShell
      colors={[
        'rgba(232,244,248,0.05)',
        'rgba(232,244,248,0.28)',
        'rgba(232,244,248,0.80)',
      ]}
      locations={[0, 0.38, 0.62]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <View style={styles_MenuScreen.topRow}>
        <View style={styles_MenuScreen.logoRound}>
          <Image source={Assets.logo} resizeMode="contain" style={styles_MenuScreen.logo} />
        </View>
        <StarsBadge earned={stars} total={maxStars()} />
      </View>

      <View style={styles_MenuScreen.spacer} />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_MenuScreen.sheet,
          {opacity: fade, transform: [{translateY: rise}]},
        ]}>
        <Text style={styles_MenuScreen.title}>FROZEN CATCH</Text>
        <Text style={styles_MenuScreen.tagline}>TIME THE SWING · READ THE WINDOW</Text>

        {cards.length >= 2 ? (
          <View style={styles_MenuScreen.statRow}>
            {cards.map(c => (
              <View key={c.key} style={styles_MenuScreen.statSlot}>
                <StatCard value={c.value} label={c.label} valueColor={c.color} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles_MenuScreen.firstRun}>
            <Text style={styles_MenuScreen.firstRunText}>
              FIRST CUT IN THE ICE · LEVEL 1 IS OPEN
            </Text>
          </View>
        )}

        <Text style={styles_MenuScreen.hint}>
          NEXT: LEVEL {nextLevel.index} · {nextLevel.name}
        </Text>

        <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} />

        <View style={styles_MenuScreen.grid}>
          <View style={styles_MenuScreen.gridRow}>
            <View style={styles_MenuScreen.gridCell}>
              <SecondaryButton
                label="LEVELS"
                Icon={LayoutGrid}
                onPress={onLevels}
              />
            </View>
            <View style={styles_MenuScreen.gridCell}>
              <SecondaryButton
                label="COLLECTION"
                Icon={BookOpen}
                onPress={onCollection}
              />
            </View>
          </View>
          <View style={styles_MenuScreen.gridRow}>
            <View style={styles_MenuScreen.gridCell}>
              <SecondaryButton
                label="PROGRESS"
                Icon={BarChart3}
                onPress={onProgress}
              />
            </View>
            <View style={styles_MenuScreen.gridCell}>
              <SecondaryButton
                label="SETTINGS"
                Icon={LucideSettings}
                onPress={onSettings}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}


export { MenuScreen_MenuScreen as MenuScreen };

// ------ ProgressScreen ------
interface Props_ProgressScreen {
  profile: Profile;
  onMenu: () => void;
  onPlay: () => void;
}

const LURE_ICONS_ProgressScreen: Record<LureId, IconCmp> = {
  bare: Anchor,
  glow: Sparkles,
  steel: ShieldCheck,
  quick: Zap,
};

function ProgressScreen_ProgressScreen({profile, onMenu, onPlay}: Props_ProgressScreen) {
  const stars = totalStars(profile);
  const best = bestScoreOverall(profile);
  const species = speciesDiscovered(profile);
  const fresh = profile.totalCatch === 0 && stars === 0 && best === 0;

  const tiles = useMemo(() => {
    const list: Array<{key: string; value: string; label: string; color: string}> =
      [];
    list.push({
      key: 'levels',
      value: profile.unlockedLevel + ' / ' + LEVEL_COUNT,
      label: 'LEVELS OPEN',
      color: COLORS.accent,
    });
    if (stars > 0) {
      list.push({
        key: 'stars',
        value: stars + ' / ' + maxStars(),
        label: 'STARS EARNED',
        color: COLORS.gold,
      });
    }
    if (profile.totalCatch > 0) {
      list.push({
        key: 'catch',
        value: formatPoints(profile.totalCatch),
        label: 'TOTAL CATCH',
        color: COLORS.success,
      });
    }
    if (best > 0) {
      list.push({
        key: 'best',
        value: formatPoints(best),
        label: 'BEST SCORE',
        color: COLORS.aurora,
      });
    }
    if (profile.bestStreak > 0) {
      list.push({
        key: 'streak',
        value: 'x' + profile.bestStreak,
        label: 'BEST STREAK',
        color: COLORS.danger,
      });
    }
    if (species > 0) {
      list.push({
        key: 'species',
        value: species + ' / ' + SPECIES_ORDER.length,
        label: 'SPECIES LOGGED',
        color: COLORS.accentDeep,
      });
    }
    return list;
  }, [best, profile.bestStreak, profile.totalCatch, profile.unlockedLevel, species, stars]);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="PROGRESS"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={<StarsBadge earned={stars} total={maxStars()} />}
      />

      <View style={styles_ProgressScreen.body}>
        {fresh ? (
          <View style={styles_ProgressScreen.freshWrap}>
            <EmptyState
              title="NOTHING ON THE LINE YET"
              line="CUT THE FIRST HOLE AND THE LOG STARTS FILLING ITSELF"
            />
            <View style={styles_ProgressScreen.freshCta}>
              <PrimaryButton
                label="PLAY NOW"
                Icon={Play}
                onPress={onPlay}
                height={58}
              />
            </View>
          </View>
        ) : null}

        {!fresh && tiles.length >= 2 ? (
          <View style={styles_ProgressScreen.grid}>
            {tiles.map(t => (
              <View key={t.key} style={styles_ProgressScreen.cell}>
                <StatCard value={t.value} label={t.label} valueColor={t.color} />
              </View>
            ))}
          </View>
        ) : null}

        {!fresh ? <Text style={styles_ProgressScreen.sectionTitle}>LURE TRACK</Text> : null}
        {!fresh
          ? LURES.filter(l => l.starsNeeded > 0).map(l => (
              <View key={l.id} style={styles_ProgressScreen.trackSlot}>
                <TrackRow
                  Icon={LURE_ICONS_ProgressScreen[l.id]}
                  title={l.name}
                  requirement={
                    stars >= l.starsNeeded
                      ? l.perk
                      : stars + ' / ' + l.starsNeeded + ' STARS'
                  }
                  have={stars}
                  need={l.starsNeeded}
                  unlocked={stars >= l.starsNeeded}
                />
              </View>
            ))
          : null}

        {!fresh ? <Text style={styles_ProgressScreen.sectionTitle}>ZONE BEST</Text> : null}
        {!fresh ? (
          <View style={styles_ProgressScreen.zoneRow}>
            {ZONES.map(z => (
              <View key={z.id} style={styles_ProgressScreen.zonePill}>
                <Text style={styles_ProgressScreen.zoneName} numberOfLines={1}>
                  {z.name}
                </Text>
                <Text style={styles_ProgressScreen.zoneValue} numberOfLines={1}>
                  {formatPoints(profile.zoneBest[z.id] || 0)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}


export { ProgressScreen_ProgressScreen as ProgressScreen };

// ------ ResultScreen ------
interface Props_ResultScreen {
  outcome: RoundOutcome;
  unlocks: Unlocks;
  onAgain: () => void;
  onNext: () => void;
  onCollection: () => void;
  onMenu: () => void;
}

const VERDICT_ResultScreen: Record<string, string> = {
  quota: 'ORDER FILLED',
  timeout: 'ICE WINDOW CLOSED',
  line: 'LINE SNAPPED',
};

function lureName_ResultScreen(id: LureId): string {
  for (let i = 0; i < LURES.length; i++) {
    if (LURES[i].id === id) {
      return LURES[i].name;
    }
  }
  return 'LURE';
}

function ResultScreen_ResultScreen({
  outcome,
  unlocks,
  onAgain,
  onNext,
  onCollection,
  onMenu,
}: Props_ResultScreen) {
  const won = outcome.won;
  const total = outcome.breakdown.total;
  const [shown, setShown] = useState(0);
  const starPop = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const start = Date.now();
    const id = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / SCORE_COUNT_MS);
      setShown(Math.round(total * p));
      if (p >= 1) {
        clearInterval(id);
      }
    }, 40);
    return () => {
      clearInterval(id);
    };
  }, [total]);

  useEffect(() => {
    Animated.spring(starPop, {
      toValue: 1,
      tension: 150,
      friction: 11,
      useNativeDriver: true,
    }).start();
  }, [starPop]);

  const rows = useMemo(() => {
    const keys = Object.keys(outcome.caught) as SpeciesKey[];
    return keys
      .filter(k => (outcome.caught[k] || 0) > 0)
      .slice(0, 4)
      .map(k => ({
        key: k,
        count: outcome.caught[k] || 0,
        def: SPECIES[k],
      }));
  }, [outcome.caught]);

  const unlockLine = useMemo(() => {
    if (unlocks.species.length > 0) {
      return 'NEW: ' + SPECIES[unlocks.species[0]].name + ' ADDED TO THE ICE LOG';
    }
    if (unlocks.lures.length > 0) {
      return 'LURE UNLOCKED: ' + lureName_ResultScreen(unlocks.lures[0]);
    }
    if (unlocks.nextLevel) {
      return 'LEVEL ' + Math.min(LEVEL_COUNT, outcome.level + 1) + ' IS OPEN';
    }
    return '';
  }, [outcome.level, unlocks]);

  const canAdvance = won && outcome.level < LEVEL_COUNT;

  return (
    <ScreenShell
      colors={
        won
          ? ['rgba(11,42,67,0.86)', 'rgba(0,85,139,0.80)']
          : ['rgba(11,42,67,0.92)', 'rgba(18,48,68,0.92)']
      }
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={won ? 0.34 : 0.08}>
      <View style={styles_ResultScreen.body}>
        <Text style={styles_ResultScreen.kicker}>
          LEVEL {outcome.level} · {won ? 'CLEARED' : 'FAILED'}
        </Text>
        <Text style={[styles_ResultScreen.verdict, won ? styles_ResultScreen.verdictWin : null]}>
          {VERDICT_ResultScreen[outcome.reason] || 'ICE WINDOW CLOSED'}
        </Text>

        <Animated.View
          pointerEvents="none"
          style={[styles_ResultScreen.stars, {transform: [{scale: starPop}]}]}>
          <StarStrip
            earned={outcome.stars}
            size={34}
            emptyColor="rgba(255,255,255,0.22)"
          />
        </Animated.View>

        <Text style={styles_ResultScreen.score}>{formatPoints(shown)}</Text>
        <Text style={styles_ResultScreen.breakdown} numberOfLines={2}>
          CATCH {formatPoints(outcome.breakdown.catchScore)} · TIME BONUS{' '}
          {formatPoints(outcome.breakdown.timeBonus)} · LINE BONUS{' '}
          {formatPoints(outcome.breakdown.lineBonus)} · BEST STREAK x
          {outcome.bestStreak}
        </Text>

        {rows.length > 0 ? (
          <View style={styles_ResultScreen.catchCard}>
            {rows.map(r => (
              <View key={r.key} style={styles_ResultScreen.catchRow}>
                <Image
                  source={r.def.sprite}
                  resizeMode="contain"
                  style={styles_ResultScreen.catchSprite}
                />
                <Text style={styles_ResultScreen.catchName} numberOfLines={1}>
                  {r.def.name}
                </Text>
                <Text style={styles_ResultScreen.catchCount}>x {r.count}</Text>
                <Text style={styles_ResultScreen.catchPts}>
                  {r.def.hazard ? '0' : formatPoints(r.def.value * r.count)}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <EmptyState
            title="THE WINDOW CLOSED EMPTY"
            line="NOTHING CAME UP ON THE LINE THIS RUN"
            tone="dark"
          />
        )}

        {unlockLine ? (
          <View style={styles_ResultScreen.unlock}>
            <Text style={styles_ResultScreen.unlockText} numberOfLines={2}>
              {unlockLine}
            </Text>
          </View>
        ) : null}

        <View style={styles_ResultScreen.spacer} />

        <PrimaryButton label="PLAY AGAIN" Icon={Play} onPress={onAgain} />
        <View style={styles_ResultScreen.gap} />
        {canAdvance ? (
          <SecondaryButton
            label="NEXT LEVEL"
            Icon={SkipForward}
            tone="dark"
            onPress={onNext}
          />
        ) : null}
        {canAdvance ? <View style={styles_ResultScreen.gap} /> : null}
        <View style={styles_ResultScreen.row}>
          <View style={styles_ResultScreen.cell}>
            <SecondaryButton
              label="COLLECTION"
              Icon={BookOpen}
              tone="dark"
              onPress={onCollection}
            />
          </View>
          <View style={styles_ResultScreen.cell}>
            <SecondaryButton
              label="MENU"
              Icon={Home}
              tone="dark"
              onPress={onMenu}
            />
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}


export { ResultScreen_ResultScreen as ResultScreen };

// ------ SettingsScreen ------
interface Props_SettingsScreen {
  profile: Profile;
  onMenu: () => void;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
}

const SWINGS_SettingsScreen: SwingSpeed[] = ['CALM', 'NORMAL', 'FAST'];

function SettingsScreen_SettingsScreen({profile, onMenu, onChange, onReset}: Props_SettingsScreen) {
  const s = profile.settings;
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const onResetPress = useCallback(() => {
    if (!armed) {
      setArmed(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setArmed(false), 4000);
      return;
    }
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setArmed(false);
    onReset();
    onMenu();
  }, [armed, onMenu, onReset]);

  const modifier = settingsModifier(s.swing, s.hazardMarkers);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader title="SETTINGS" leftSlot={<MenuPill onPress={onMenu} />} />

      <View style={styles_SettingsScreen.body}>
        <View style={styles_SettingsScreen.block}>
          <Text style={styles_SettingsScreen.title}>SWING SPEED</Text>
          <Text style={styles_SettingsScreen.sub}>
            PENDULUM PERIOD {SWING_PERIODS[s.swing]} MS
          </Text>
          <View style={styles_SettingsScreen.row}>
            {SWINGS_SettingsScreen.map(v => (
              <Chip
                key={v}
                label={v}
                active={s.swing === v}
                height={44}
                onPress={() => onChange({swing: v})}
              />
            ))}
          </View>
          <Text style={styles_SettingsScreen.note}>
            FAST PAYS x1.10 · CURRENT SCORE MODIFIER x{modifier.toFixed(2)}
          </Text>
        </View>

        <View style={styles_SettingsScreen.block}>
          <Text style={styles_SettingsScreen.title}>HAZARD MARKERS</Text>
          <Text style={styles_SettingsScreen.sub}>
            A RED RING AROUND THE PIKE AND THE RELIC
          </Text>
          <View style={styles_SettingsScreen.row}>
            <Chip
              label="ON"
              active={s.hazardMarkers}
              height={44}
              onPress={() => onChange({hazardMarkers: true})}
            />
            <Chip
              label="OFF"
              active={!s.hazardMarkers}
              height={44}
              onPress={() => onChange({hazardMarkers: false})}
            />
          </View>
          <Text style={styles_SettingsScreen.note}>PLAYING WITHOUT MARKERS PAYS x1.05</Text>
        </View>

        <View style={styles_SettingsScreen.block}>
          <Text style={styles_SettingsScreen.title}>SPECIES TAGS</Text>
          <Text style={styles_SettingsScreen.sub}>
            THE LETTER C / P / G UNDER EVERY SWIMMER
          </Text>
          <View style={styles_SettingsScreen.row}>
            <Chip
              label="ON"
              active={s.speciesTags}
              height={44}
              onPress={() => onChange({speciesTags: true})}
            />
            <Chip
              label="OFF"
              active={!s.speciesTags}
              height={44}
              onPress={() => onChange({speciesTags: false})}
            />
          </View>
          <Text style={styles_SettingsScreen.note}>
            READ SPECIES WITHOUT RELYING ON COLOUR · NO SCORE EFFECT
          </Text>
        </View>

        <View style={styles_SettingsScreen.spacer} />

        <SecondaryButton
          label={armed ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
          Icon={Trash2}
          tone="danger"
          height={52}
          onPress={onResetPress}
        />
        <Text style={styles_SettingsScreen.footer}>{PRODUCT_FOOTER}</Text>
      </View>
    </ScreenShell>
  );
}


export { SettingsScreen_SettingsScreen as SettingsScreen };

/* autopad-begin */
function odayenaqumag(_orexabireg: string): number { return 256; }
function iceyeqoqili(_iwonazax: number, _edavecaye: boolean, _mawulikeraco: number): string {
  const efuyotax = 45;
  return efuyotax > 18 ? "tidicavu" : "mocagubi";
}
function nacoqokazel(_adekopisox: boolean, _uxijopumuyum: boolean): boolean {
  const toyewamuxe: boolean = false;
  return toyewamuxe;
}
function lunelezozad(_uneyix: string, _ejiriqina: boolean, _letalifepu: number): void {
  const ufewekuyu = 24;
  if (ufewekuyu > 14) return;
}
function usigazar(_uyecagakiwic: number): void {}
function amaful(_oletoji: boolean, _qayuqafo: boolean, _nuyojifutir: string): void {
  const xitokewe: boolean = true;
}
function inexisafupi(_torujalop: number): string {
  const zuvucewe: string = "ifuv";
  return zuvucewe;
}
function umajuco(_gutigafotuk: boolean, _owometawuf: number, _egofiquwa: number): void {
  const afujitil = 54;
  if (afujitil > 83) return;
}
function vunuqe(_ebawomozos: number, _jewoyi: string, _fanixojuvol: number): string {
  const vomicepetowe: string = "utomub";
  return vomicepetowe;
}
function becuyagoli(_pesusifesabu: boolean): number {
  return 119;
}
function rodiwoyojoci(): void {}
function takosimepaq(_ijicevunucun: string, _jadafode: string, _osulorogiyiw: number): number { return 33; }
function moxigivin(_perepojot: boolean, _towumu: boolean, _bejemom: string): void {
  const eqapulayur = 21;
  if (eqapulayur > 57) return;
}
function amuxijuzi(_ejegokizis: boolean, _ciciqebuse: string, _femani: string): void {
  const iwekifica = 43;
  if (iwekifica > 24) return;
}
/* autopad-end */
