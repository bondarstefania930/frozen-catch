import React, {useCallback, useMemo, useRef, useState} from 'react';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {ArrowDownCircle} from 'lucide-react-native';
import Assets from '../assets';
import ScreenShell from '../components/ScreenShell';
import AppHeader from '../components/AppHeader';
import RoundIconButton from '../components/RoundIconButton';
import LineGauge from '../components/LineGauge';
import QuotaChip from '../components/QuotaChip';
import WindowBanner from '../components/WindowBanner';
import WaterColumn from '../components/WaterColumn';
import HookLine from '../components/HookLine';
import FishSprite, {FISH_H, FISH_W} from '../components/FishSprite';
import FloatScore from '../components/FloatScore';
import PrimaryButton from '../components/PrimaryButton';
import PauseOverlay from '../components/PauseOverlay';
import {useGameLoop} from '../hooks/useGameLoop';
import {useSwing} from '../hooks/useSwing';
import {
  COLUMN_W,
  DROP_SPEED,
  ICE_CEILING_H,
  IDLE_LINE_LEN,
  LINE_SEGMENTS,
  MAX_NUDGES,
  REEL_SPEED_JUNK,
  RESOLVE_MS,
  ROUND_SECONDS,
  SURGE_MS,
  SWING_PERIODS,
  TICK_MS,
  WINDOW_SECONDS,
} from '../constants/config';
import {COLORS, HEADER_TOP, RADIUS, SCREEN_H} from '../constants/theme';
import {SPECIES, SpeciesKey, tierBonus} from '../game/collection';
import {getLevel, quotaLabel} from '../game/levels';
import {getLure} from '../game/lures';
import {Profile, RoundOutcome} from '../game/profile';
import {generateRun, WINDOW_NAMES, windowIndexAt} from '../game/spawn';
import {applyNudge, findGrab, hookPoint} from '../game/hook';
import {
  RunState,
  makeRunState,
  quotaComplete,
  resolveCatch,
} from '../game/resolve';
import {
  finalScore,
  formatClock,
  formatPoints,
  settingsModifier,
  starsFor,
  streakMultiplier,
} from '../game/scoring';

interface Props {
  profile: Profile;
  level: number;
  attempt: number;
  onGameOver: (outcome: RoundOutcome) => void;
  onMenu: () => void;
  onRestart: () => void;
}

const HEADER_H = HEADER_TOP + 68;
const ORDER_H = 54;
const BANNER_H = 42;
const BAR_H = 92;
const BAR_BOTTOM = 20;
const COLUMN_H = Math.max(
  260,
  SCREEN_H - HEADER_H - ORDER_H - BANNER_H - BAR_H - BAR_BOTTOM - 16,
);
const PIVOT_X = COLUMN_W / 2;
const PIVOT_Y = ICE_CEILING_H - 4;
const MAX_LINE = COLUMN_H - 74 - PIVOT_Y;
const NUDGE_LIMIT = COLUMN_W / 2 - 24;

type HookPhase = 'idle' | 'descending' | 'reeling' | 'resolve';

interface Entity {
  id: number;
  species: SpeciesKey;
  x: number;
  y: number;
  baseY: number;
  vx: number;
  bob: number;
}

interface Floater {
  id: number;
  text: string;
  x: number;
  y: number;
  color: string;
  born: number;
}

interface ViewState {
  entities: Entity[];
  hookX: number;
  hookY: number;
  phase: HookPhase;
  secondsLeft: number;
  windowIndex: number;
  run: RunState;
  nudgesLeft: number;
  surge: boolean;
  floaters: Floater[];
}

function GameScreen({
  profile,
  level,
  attempt,
  onGameOver,
  onMenu,
  onRestart,
}: Props) {
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
    entities: [] as Entity[],
    floaters: [] as Floater[],
    phase: 'idle' as HookPhase,
    lineLen: IDLE_LINE_LEN,
    angle: 0,
    nudgeX: 0,
    nudgesLeft: MAX_NUDGES,
    carried: null as Entity | null,
    reelSpeed: lure.reelSpeed,
    resolveUntil: 0,
    surgeUntil: 0,
    surgeFired: false,
    lastPush: 0,
    lastPhase: 'idle' as HookPhase,
    run: makeRunState(def.quota, LINE_SEGMENTS),
  });

  const getPeriod = useCallback(() => periodMs, [periodMs]);
  const swing = useSwing(getPeriod);

  const hazardFlash = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  const [view, setView] = useState<ViewState>(() => ({
    entities: [],
    hookX: PIVOT_X,
    hookY: PIVOT_Y + IDLE_LINE_LEN,
    phase: 'idle',
    secondsLeft: ROUND_SECONDS,
    windowIndex: 0,
    run: world.current.run,
    nudgesLeft: MAX_NUDGES,
    surge: false,
    floaters: [],
  }));

  const bandY = useCallback((band: number) => {
    const usable = COLUMN_H - ICE_CEILING_H - 86;
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

      const alive: Entity[] = [];
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
          {x: PIVOT_X, y: PIVOT_Y},
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
        } else if (w.lineLen >= MAX_LINE) {
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
              {x: PIVOT_X, y: PIVOT_Y},
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
        {x: PIVOT_X, y: PIVOT_Y},
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
        : PIVOT_X;
    const dir: -1 | 1 = lx < COLUMN_W / 2 ? -1 : 1;
    const next = applyNudge(w.nudgeX, w.nudgesLeft, dir, NUDGE_LIMIT);
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

      <View style={styles.orderRow}>
        <Text style={styles.orderLabel}>ORDER</Text>
        <View style={styles.orderChips}>
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

      <View style={styles.bannerRow}>
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
        style={styles.columnTouch}
        onPress={onColumnTap}
        accessibilityLabel="STEER THE LINE">
        <WaterColumn
          width={COLUMN_W}
          height={COLUMN_H}
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
            height={COLUMN_H}
            pivotX={PIVOT_X}
            pivotY={PIVOT_Y}
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

      <View style={styles.bar}>
        <View style={styles.barLeft}>
          <Text style={styles.barLabel}>TIME</Text>
          <Text style={styles.clock}>{formatClock(view.secondsLeft)}</Text>
          {view.run.streak >= 2 ? (
            <View style={styles.streakChip}>
              <Text style={styles.streakText}>
                x{streakMultiplier(view.run.streak)} STREAK
              </Text>
            </View>
          ) : null}
        </View>
        <View style={styles.barRight}>
          <PrimaryButton
            label={dropBusy ? 'REELING…' : 'DROP'}
            Icon={ArrowDownCircle}
            onPress={onDrop}
            disabled={dropBusy}
            height={62}
          />
          <Text style={styles.nudge}>
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

const styles = StyleSheet.create({
  orderRow: {
    height: ORDER_H,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  orderLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  orderChips: {flexDirection: 'row', gap: 8, flexShrink: 1},
  bannerRow: {height: BANNER_H},
  columnTouch: {
    width: COLUMN_W,
    height: COLUMN_H,
    alignSelf: 'center',
  },
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: BAR_BOTTOM,
    height: BAR_H,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.glassDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 14,
  },
  barLeft: {flex: 1},
  barLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  clock: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.textOnDark,
    fontVariant: ['tabular-nums'],
  },
  streakChip: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(123,228,214,0.22)',
    borderWidth: 1,
    borderColor: COLORS.aurora,
  },
  streakText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.aurora,
  },
  barRight: {width: 158, alignItems: 'center'},
  nudge: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textOnDarkDim,
    marginTop: 4,
  },
});

export default GameScreen;
