import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {AURORA_LOOP_MS} from '../constants/config';
import {COLORS} from '../constants/theme';

interface Props {
  /** 0.06 on light screens, up to 0.38 during an Aurora Surge. */
  intensity: number;
}

/**
 * The one decor element that appears on every screen at a different intensity
 * — soft rounded blobs drifting sideways. Transform only, native driver.
 */
function AuroraField({intensity}: Props) {
  const drift = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(intensity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: AURORA_LOOP_MS,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: AURORA_LOOP_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [drift]);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: intensity,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fade, intensity]);

  const shiftA = useMemo(
    () => drift.interpolate({inputRange: [0, 1], outputRange: [-26, 26]}),
    [drift],
  );
  const shiftB = useMemo(
    () => drift.interpolate({inputRange: [0, 1], outputRange: [22, -22]}),
    [drift],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blobA,
          {opacity: fade, transform: [{translateX: shiftA}, {rotate: '-18deg'}]},
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blobB,
          {opacity: fade, transform: [{translateX: shiftB}, {rotate: '12deg'}]},
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.blob,
          styles.blobC,
          {opacity: fade, transform: [{translateX: shiftA}, {rotate: '6deg'}]},
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 320,
    height: 160,
    borderRadius: 160,
  },
  blobA: {top: 70, left: -70, backgroundColor: COLORS.aurora},
  blobB: {top: 170, right: -90, backgroundColor: COLORS.accent},
  blobC: {top: 300, left: -40, backgroundColor: COLORS.aurora},
});

export default React.memo(AuroraField);
