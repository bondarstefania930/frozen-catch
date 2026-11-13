import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {CATCH_MS} from '../constants/config';
import {COLORS} from '../constants/theme';

interface Props {
  text: string;
  x: number;
  y: number;
  color?: string;
}

/** The rising +N label. Self-animating, dies with its parent render. */
function FloatScore({text, x, y, color = COLORS.aurora}: Props) {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: CATCH_MS,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const translateY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });
  const opacity = rise.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.Text
      style={[
        styles.text,
        {left: x - 60, top: y, color, opacity, transform: [{translateY}]},
      ]}>
      {text}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  text: {
    position: 'absolute',
    width: 120,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

export default React.memo(FloatScore);
