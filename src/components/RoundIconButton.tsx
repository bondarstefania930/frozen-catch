import React from 'react';
import {Animated, Image, ImageBackground, Pressable, StyleSheet} from 'react-native';
import Assets from '../assets';
import {usePressScale} from '../hooks/usePressScale';
import {HIT_SLOP} from '../constants/theme';

interface Props {
  source: any;
  label: string;
  onPress: () => void;
}

/** 44 x 44 round plate with a fixed 24 x 24 glyph. Never icon-only for a CTA. */
function RoundIconButton({source, label, onPress}: Props) {
  const press = usePressScale(0.9);
  return (
    <Pressable
      style={styles.btn}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles.inner, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRound}
          resizeMode="contain"
          style={styles.plate}>
          <Image source={source} style={styles.glyph} resizeMode="contain" />
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {width: 44, height: 44},
  inner: {width: 44, height: 44},
  plate: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  glyph: {width: 24, height: 24},
});

export default React.memo(RoundIconButton);
