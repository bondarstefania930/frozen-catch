import React from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Star} from 'lucide-react-native';
import Assets from '../assets';
import {usePressScale} from '../hooks/usePressScale';
import {COLORS, HEADER_TOP, HIT_SLOP, RADIUS} from '../constants/theme';

interface HeaderProps {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
}

/** One header component for every screen — only the slots change. */
export function AppHeader({
  title,
  leftSlot,
  rightSlot,
  tone = 'light',
}: HeaderProps) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.header,
        {
          backgroundColor: dark
            ? 'rgba(11,42,67,0.34)'
            : 'rgba(255,255,255,0.5)',
          borderBottomColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <View style={styles.side}>{leftSlot}</View>
      <Text
        style={[
          styles.title,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}
        numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

/** The header route home: icon_home plate + the literal word MENU. */
export function MenuPill({onPress}: {onPress: () => void}) {
  const press = usePressScale(0.94);
  return (
    <Pressable
      style={styles.pill}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel="MENU">
      <Animated.View
        pointerEvents="box-none"
        style={[styles.pillFill, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRect}
          resizeMode="stretch"
          style={styles.pillPlate}
          imageStyle={styles.pillImage}>
          <View style={styles.pillRow}>
            <Image
              source={Assets.iconHome}
              style={styles.pillIcon}
              resizeMode="contain"
            />
            <Text style={styles.pillLabel}>MENU</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

export function StarsBadge({
  earned,
  total,
  tone = 'light',
}: {
  earned: number;
  total: number;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: dark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.72)',
          borderColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <Star size={24} color={COLORS.gold} fill={COLORS.gold} strokeWidth={2} />
      <Text
        style={[
          styles.badgeText,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}>
        {earned} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: HEADER_TOP,
    height: HEADER_TOP + 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  side: {width: 118, justifyContent: 'center'},
  sideRight: {alignItems: 'flex-end'},
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  pill: {width: 112, height: 46},
  pillFill: {width: 112, height: 46},
  pillPlate: {
    width: 112,
    height: 46,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillImage: {borderRadius: RADIUS.md, opacity: 0.85},
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pillIcon: {width: 24, height: 24},
  pillLabel: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.accentDeep,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

export default AppHeader;
