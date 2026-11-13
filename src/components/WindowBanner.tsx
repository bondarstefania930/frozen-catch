import React, {useEffect, useRef} from 'react';
import {Animated, Easing, StyleSheet, Text} from 'react-native';
import {BANNER_MS} from '../constants/config';
import {COLORS, RADIUS} from '../constants/theme';

interface Props {
  name: string;
  secondsLeft: number;
  highlight?: boolean;
}

/** Slides in on every window change, so the screen changes without input. */
function WindowBanner({name, secondsLeft, highlight = false}: Props) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: BANNER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [name, slide]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.banner,
        highlight ? styles.surge : null,
        {opacity: slide, transform: [{translateX}]},
      ]}>
      <Text style={styles.text} numberOfLines={1}>
        {name} · {secondsLeft}s
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    height: 34,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginLeft: 16,
    marginTop: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(11,42,67,0.55)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  surge: {
    backgroundColor: 'rgba(123,228,214,0.3)',
    borderColor: COLORS.aurora,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textOnDark,
  },
});

export default React.memo(WindowBanner);
