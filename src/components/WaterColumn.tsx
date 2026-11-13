import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {GRADIENTS, COLORS, RADIUS} from '../constants/theme';
import {HOLE_W, ICE_CEILING_H} from '../constants/config';
import AuroraField from './AuroraField';

interface Props {
  width: number;
  height: number;
  auroraIntensity: number;
  hazardFlash: Animated.Value;
  hint: string;
  children: React.ReactNode;
}

interface Seed {
  x: number;
  size: number;
  delay: number;
  duration: number;
}

function Bubble({seed, height}: {seed: Seed; height: number}) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(seed.delay),
        Animated.timing(v, {
          toValue: 1,
          duration: seed.duration,
          useNativeDriver: true,
        }),
        Animated.timing(v, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [seed, v]);

  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [height - 20, ICE_CEILING_H + 10],
  });
  const opacity = v.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 0.22, 0.12, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.bubble,
        {
          left: seed.x,
          width: seed.size,
          height: seed.size,
          borderRadius: seed.size,
          opacity,
          transform: [{translateY}],
        },
      ]}
    />
  );
}

function Bubbles({width, height}: {width: number; height: number}) {
  const seeds = useMemo<Seed[]>(() => {
    const span = Math.max(1, width - 28);
    const out: Seed[] = [];
    for (let i = 0; i < 12; i++) {
      out.push({
        x: 14 + ((i * 97) % span),
        size: 3 + (i % 4),
        delay: (i * 430) % 5200,
        duration: 5200 + ((i * 311) % 2600),
      });
    }
    return out;
  }, [width]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {seeds.map((s, i) => (
        <Bubble key={i} seed={s} height={height} />
      ))}
    </View>
  );
}

function WaterColumn({
  width,
  height,
  auroraIntensity,
  hazardFlash,
  hint,
  children,
}: Props) {
  return (
    <View style={[styles.column, {width: width, height: height}]}>
      <LinearGradient
        colors={GRADIENTS.water}
        locations={[0, 0.22, 0.58, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.auroraClip} pointerEvents="none">
        <AuroraField intensity={auroraIntensity} />
      </View>
      <Bubbles width={width} height={height} />

      <View style={[styles.ice, {width: width}]} pointerEvents="none">
        <View style={styles.hole} />
      </View>

      {children}

      <View style={[styles.hintStrip, {width: width}]} pointerEvents="none">
        <Text style={styles.hintText} numberOfLines={2}>
          {hint}
        </Text>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles.flash, {opacity: hazardFlash}]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.hairlineDark,
    alignSelf: 'center',
    backgroundColor: COLORS.abyss,
  },
  bubble: {position: 'absolute', top: 0, backgroundColor: '#FFFFFF'},
  auroraClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    overflow: 'hidden',
  },
  ice: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ICE_CEILING_H,
    backgroundColor: 'rgba(242,251,255,0.9)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  hole: {
    width: HOLE_W,
    height: 22,
    borderRadius: 16,
    backgroundColor: COLORS.abyss,
    marginBottom: -6,
  },
  hintStrip: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(11,42,67,0.45)',
  },
  hintText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
    color: COLORS.textOnDark,
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.xl,
    borderWidth: 3,
    borderColor: COLORS.danger,
  },
});

export default WaterColumn;
