import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Home, Play, RotateCcw} from 'lucide-react-native';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';
import {formatPoints} from '../game/scoring';

interface Props {
  score: number;
  orderLine: string;
  secondsLeft: number;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

function PauseOverlay({
  score,
  orderLine,
  secondsLeft,
  onResume,
  onRestart,
  onMenu,
}: Props) {
  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>PAUSED</Text>
        <Text style={styles.line}>{orderLine}</Text>
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{formatPoints(score)}</Text>
            <Text style={styles.statLabel}>POINTS</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{secondsLeft}s</Text>
            <Text style={styles.statLabel}>WINDOW LEFT</Text>
          </View>
        </View>
        <PrimaryButton
          label="RESUME"
          Icon={Play}
          onPress={onResume}
          height={58}
        />
        <View style={styles.gap} />
        <SecondaryButton
          label="RESTART"
          Icon={RotateCcw}
          tone="dark"
          onPress={onRestart}
        />
        <View style={styles.gap} />
        <SecondaryButton
          label="MENU"
          Icon={Home}
          tone="dark"
          onPress={onMenu}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,42,67,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 22,
    ...SHADOW.win,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textOnDark,
    textAlign: 'center',
  },
  line: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.3,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 4,
  },
  statsRow: {flexDirection: 'row', gap: 12, marginVertical: 16},
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.aurora,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textOnDarkDim,
  },
  gap: {height: 10},
});

export default PauseOverlay;
