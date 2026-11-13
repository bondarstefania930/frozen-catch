import React from 'react';
import {Animated, Pressable, StyleSheet, Text} from 'react-native';
import {Lock} from 'lucide-react-native';
import StarStrip from './StarStrip';
import {usePressScale} from '../hooks/usePressScale';
import {COLORS, HIT_SLOP, RADIUS, SHADOW} from '../constants/theme';

interface Props {
  index: number;
  size: number;
  stars: number;
  locked: boolean;
  selected: boolean;
  onPress: () => void;
}

function LevelTile({index, size, stars, locked, selected, onPress}: Props) {
  const press = usePressScale(0.93);
  return (
    <Pressable
      style={[styles.tile, {width: size, height: size}]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{disabled: locked, selected: selected}}
      accessibilityLabel={'LEVEL ' + index}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          locked ? styles.locked : styles.open,
          selected ? styles.selected : null,
          {transform: [{scale: press.scale}]},
        ]}>
        {locked ? (
          <Lock size={24} color={COLORS.textMuted} strokeWidth={2} />
        ) : null}
        {locked ? null : <Text style={styles.number}>{index}</Text>}
        {locked ? null : <StarStrip earned={stars} size={12} />}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {borderRadius: RADIUS.md},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  open: {
    backgroundColor: COLORS.glassLightSoft,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  locked: {backgroundColor: COLORS.surface, borderColor: COLORS.surfaceAlt},
  selected: {borderColor: COLORS.accent, borderWidth: 2},
  number: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.accentDeep,
    fontVariant: ['tabular-nums'],
  },
});

export default React.memo(LevelTile);
