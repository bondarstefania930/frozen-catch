import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {usePressScale} from '../hooks/usePressScale';
import {COLORS, HIT_SLOP, RADIUS} from '../constants/theme';
import type {IconCmp} from './PrimaryButton';

interface Props {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  tone?: 'light' | 'dark' | 'danger';
  height?: number;
  style?: any;
}

function SecondaryButton({
  label,
  Icon,
  onPress,
  tone = 'light',
  height = 52,
  style,
}: Props) {
  const press = usePressScale(0.95);
  const dark = tone === 'dark';
  const danger = tone === 'danger';
  const fg = danger ? COLORS.danger : dark ? COLORS.textOnDark : COLORS.textPrimary;
  const bg = danger
    ? 'rgba(227,93,91,0.14)'
    : dark
    ? 'rgba(255,255,255,0.12)'
    : COLORS.glassLight;
  const bd = danger ? COLORS.danger : dark ? COLORS.hairlineDark : COLORS.border;

  return (
    <Pressable
      style={[styles.btn, {height}, style]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.fill,
          {
            backgroundColor: bg,
            borderColor: bd,
            transform: [{scale: press.scale}],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={24} color={fg} strokeWidth={2} /> : null}
          <Text style={[styles.label, {color: fg}]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {width: '100%', borderRadius: RADIUS.md},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {fontSize: 13, lineHeight: 24, fontWeight: '700', letterSpacing: 0.8},
});

export default React.memo(SecondaryButton);
