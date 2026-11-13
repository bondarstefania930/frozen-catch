import {useCallback, useRef} from 'react';
import {Animated} from 'react-native';
import {SPRING_PRESS} from '../constants/config';

/**
 * Press feedback the only way that survives Android release builds:
 * the Pressable is the PARENT and drives an Animated.View CHILD on
 * transform.scale with the native driver. No gesture handler anywhere.
 */
export function usePressScale(to: number = 0.94) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

export default usePressScale;
