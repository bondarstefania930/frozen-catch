import React from 'react';
import {Animated, Pressable, StyleSheet, Text, View} from 'react-native';
import {Lock} from 'lucide-react-native';
import {usePressScale} from '../hooks/usePressScale';
import {COLORS, HIT_SLOP, RADIUS} from '../constants/theme';
import type {IconCmp} from './PrimaryButton';

interface Props {
  label: string;
  sublabel?: string;
  Icon?: IconCmp;
  active?: boolean;
  locked?: boolean;
  tone?: 'light' | 'dark';
  height?: number;
  onPress: () => void;
}

function Chip({
  label,
  sublabel,
  Icon,
  active = false,
  locked = false,
  tone = 'light',
  height = 44,
  onPress,
}: Props) {
  const press = usePressScale(0.96);
  const dark = tone === 'dark';
  const fg = locked
    ? COLORS.surfaceAlt
    : active
    ? COLORS.accentDeep
    : dark
    ? COLORS.textOnDarkDim
    : COLORS.textSecondary;
  const bg = active
    ? 'rgba(0,166,203,0.14)'
    : dark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(255,255,255,0.7)';
  const bd = active ? COLORS.accent : dark ? COLORS.hairlineDark : COLORS.border;
  const Glyph = locked ? Lock : Icon;

  return (
    <Pressable
      style={[styles.btn, {height}]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{selected: active, disabled: locked}}
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
          {Glyph ? <Glyph size={24} color={fg} strokeWidth={2} /> : null}
          <View style={styles.texts}>
            <Text style={[styles.label, {color: fg}]} numberOfLines={1}>
              {label}
            </Text>
            {sublabel ? (
              <Text style={styles.sub} numberOfLines={1}>
                {sublabel}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {flexGrow: 1, flexShrink: 1, borderRadius: RADIUS.pill},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  texts: {alignItems: 'flex-start'},
  label: {fontSize: 12, lineHeight: 24, fontWeight: '700', letterSpacing: 0.8},
  sub: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.textMuted,
    marginTop: -4,
  },
});

export default React.memo(Chip);
