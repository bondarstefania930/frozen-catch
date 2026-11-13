import React from 'react';
import {
  Animated,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Assets from '../assets';
import {usePressScale} from '../hooks/usePressScale';
import {COLORS, HIT_SLOP, RADIUS, SHADOW} from '../constants/theme';

import type {LucideIcon} from 'lucide-react-native';

export type IconCmp = LucideIcon;

interface Props {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  colors?: string[];
  testID?: string;
}

/** Icon exactly 24 x 24, label lineHeight 24, gap 10 — on every button. */
function PrimaryButton({
  label,
  Icon,
  onPress,
  disabled = false,
  height = 62,
  colors,
  testID,
}: Props) {
  const press = usePressScale(0.94);
  const grad = colors || [COLORS.accent, COLORS.accentDeep];

  return (
    <Pressable
      testID={testID}
      style={[styles.btn, {height}, disabled ? styles.disabled : null]}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : press.onPressIn}
      onPressOut={disabled ? undefined : press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.fill, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRect}
          resizeMode="stretch"
          style={styles.plate}
          imageStyle={styles.plateImage}>
          <LinearGradient
            colors={grad}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.grad}
            pointerEvents="none"
          />
          <View style={styles.row}>
            {Icon ? <Icon size={24} color="#FFFFFF" strokeWidth={2.2} /> : null}
            <Text style={styles.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    borderRadius: RADIUS.lg,
    ...SHADOW.primary,
  },
  disabled: {opacity: 0.45},
  fill: {width: '100%', height: '100%'},
  plate: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateImage: {borderRadius: RADIUS.lg, opacity: 0.9},
  grad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.88,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
});

export default React.memo(PrimaryButton);
