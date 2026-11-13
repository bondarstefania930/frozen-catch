import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {BookOpen, Home, Play, SkipForward} from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StarStrip from '../components/StarStrip';
import EmptyState from '../components/EmptyState';
import {COLORS, HEADER_TOP, RADIUS} from '../constants/theme';
import {SCORE_COUNT_MS} from '../constants/config';
import {SPECIES, SpeciesKey} from '../game/collection';
import {LEVEL_COUNT} from '../game/levels';
import {RoundOutcome, Unlocks} from '../game/profile';
import {LURES, LureId} from '../game/lures';
import {formatPoints} from '../game/scoring';

interface Props {
  outcome: RoundOutcome;
  unlocks: Unlocks;
  onAgain: () => void;
  onNext: () => void;
  onCollection: () => void;
  onMenu: () => void;
}

const VERDICT: Record<string, string> = {
  quota: 'ORDER FILLED',
  timeout: 'ICE WINDOW CLOSED',
  line: 'LINE SNAPPED',
};

function lureName(id: LureId): string {
  for (let i = 0; i < LURES.length; i++) {
    if (LURES[i].id === id) {
      return LURES[i].name;
    }
  }
  return 'LURE';
}

function ResultScreen({
  outcome,
  unlocks,
  onAgain,
  onNext,
  onCollection,
  onMenu,
}: Props) {
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
      return 'LURE UNLOCKED: ' + lureName(unlocks.lures[0]);
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
      <View style={styles.body}>
        <Text style={styles.kicker}>
          LEVEL {outcome.level} · {won ? 'CLEARED' : 'FAILED'}
        </Text>
        <Text style={[styles.verdict, won ? styles.verdictWin : null]}>
          {VERDICT[outcome.reason] || 'ICE WINDOW CLOSED'}
        </Text>

        <Animated.View
          pointerEvents="none"
          style={[styles.stars, {transform: [{scale: starPop}]}]}>
          <StarStrip
            earned={outcome.stars}
            size={34}
            emptyColor="rgba(255,255,255,0.22)"
          />
        </Animated.View>

        <Text style={styles.score}>{formatPoints(shown)}</Text>
        <Text style={styles.breakdown} numberOfLines={2}>
          CATCH {formatPoints(outcome.breakdown.catchScore)} · TIME BONUS{' '}
          {formatPoints(outcome.breakdown.timeBonus)} · LINE BONUS{' '}
          {formatPoints(outcome.breakdown.lineBonus)} · BEST STREAK x
          {outcome.bestStreak}
        </Text>

        {rows.length > 0 ? (
          <View style={styles.catchCard}>
            {rows.map(r => (
              <View key={r.key} style={styles.catchRow}>
                <Image
                  source={r.def.sprite}
                  resizeMode="contain"
                  style={styles.catchSprite}
                />
                <Text style={styles.catchName} numberOfLines={1}>
                  {r.def.name}
                </Text>
                <Text style={styles.catchCount}>x {r.count}</Text>
                <Text style={styles.catchPts}>
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
          <View style={styles.unlock}>
            <Text style={styles.unlockText} numberOfLines={2}>
              {unlockLine}
            </Text>
          </View>
        ) : null}

        <View style={styles.spacer} />

        <PrimaryButton label="PLAY AGAIN" Icon={Play} onPress={onAgain} />
        <View style={styles.gap} />
        {canAdvance ? (
          <SecondaryButton
            label="NEXT LEVEL"
            Icon={SkipForward}
            tone="dark"
            onPress={onNext}
          />
        ) : null}
        {canAdvance ? <View style={styles.gap} /> : null}
        <View style={styles.row}>
          <View style={styles.cell}>
            <SecondaryButton
              label="COLLECTION"
              Icon={BookOpen}
              tone="dark"
              onPress={onCollection}
            />
          </View>
          <View style={styles.cell}>
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

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: HEADER_TOP + 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  kicker: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
  },
  verdict: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textOnDark,
    textAlign: 'center',
    marginTop: 4,
  },
  verdictWin: {
    textShadowColor: COLORS.aurora,
    textShadowRadius: 18,
    textShadowOffset: {width: 0, height: 0},
  },
  stars: {alignSelf: 'center', marginTop: 12},
  score: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '800',
    color: COLORS.aurora,
    textAlign: 'center',
    marginTop: 10,
    fontVariant: ['tabular-nums'],
  },
  breakdown: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 2,
  },
  catchCard: {
    marginTop: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  catchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  catchSprite: {width: 28, height: 28},
  catchName: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: COLORS.textOnDark,
  },
  catchCount: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.textOnDarkDim,
    fontVariant: ['tabular-nums'],
  },
  catchPts: {
    width: 56,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    color: COLORS.aurora,
    fontVariant: ['tabular-nums'],
  },
  unlock: {
    marginTop: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.aurora,
    backgroundColor: 'rgba(123,228,214,0.16)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  unlockText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.aurora,
    textAlign: 'center',
  },
  spacer: {flex: 1, minHeight: 10},
  gap: {height: 10},
  row: {flexDirection: 'row', gap: 10, marginTop: 10},
  cell: {flex: 1},
});

export default ResultScreen;
