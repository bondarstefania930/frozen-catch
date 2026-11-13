import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Assets from '../assets';
import ScreenShell from '../components/ScreenShell';
import {LOADER_DURATION_MS, SPRING_POP} from '../constants/config';
import {COLORS, GRADIENTS, RADIUS} from '../constants/theme';

interface Props {
  onDone: () => void;
}

/**
 * The brand card. It holds for exactly LOADER_DURATION_MS, driven by one
 * timer — no tap to skip, no touch handler, no early exit. It is also the
 * dark screen of the app; Menu is the light one.
 */
function LoaderScreen({onDone}: Props) {
  const pop = useRef(new Animated.Value(0.82)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const titleFade = useRef(new Animated.Value(0)).current;
  const titleRise = useRef(new Animated.Value(14)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(onDone, LOADER_DURATION_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [onDone]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(pop, {
        toValue: 1,
        tension: SPRING_POP.tension,
        friction: SPRING_POP.friction,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
    ]).start();

    const title = Animated.parallel([
      Animated.timing(titleFade, {
        toValue: 1,
        duration: 420,
        delay: 220,
        useNativeDriver: true,
      }),
      Animated.timing(titleRise, {
        toValue: 0,
        duration: 420,
        delay: 220,
        useNativeDriver: true,
      }),
    ]);
    title.start();

    // width is not native-drivable — this one runs on the JS driver by design
    const bar = Animated.timing(progress, {
      toValue: 1,
      duration: LOADER_DURATION_MS,
      useNativeDriver: false,
    });
    bar.start();

    return () => {
      title.stop();
      bar.stop();
    };
  }, [fade, pop, progress, titleFade, titleRise]);

  const barWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['4%', '100%'],
  });

  return (
    <ScreenShell
      colors={[
        'rgba(11,42,67,0.94)',
        'rgba(0,85,139,0.90)',
        'rgba(0,166,203,0.86)',
      ]}
      auroraIntensity={0.16}>
      <View style={styles.root}>
        <Animated.View
          pointerEvents="none"
          style={[
            styles.card,
            {opacity: fade, transform: [{scale: pop}]},
          ]}>
          <Image source={Assets.logo} resizeMode="contain" style={styles.logo} />
        </Animated.View>

        <Animated.View
          pointerEvents="none"
          style={{opacity: titleFade, transform: [{translateY: titleRise}]}}>
          <Text style={styles.title}>FROZEN CATCH</Text>
          <Text style={styles.subtitle}>ONE HOOK · ONE WINDOW</Text>
        </Animated.View>

        <View style={styles.barTrack}>
          <Animated.View
            pointerEvents="none"
            style={[styles.barFill, {width: barWidth}]}>
            <LinearGradient
              colors={GRADIENTS.progress}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={styles.barGrad}
              pointerEvents="none"
            />
          </Animated.View>
        </View>
        <Text style={styles.loading}>LOADING…</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18},
  card: {
    width: 132,
    height: 132,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 10},
    elevation: 10,
  },
  logo: {width: 96, height: 96},
  title: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#F2FBFF',
    textAlign: 'center',
    textShadowColor: COLORS.aurora,
    textShadowRadius: 16,
    textShadowOffset: {width: 0, height: 0},
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 6,
  },
  barTrack: {
    width: 180,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginTop: 10,
  },
  barFill: {height: 6, borderRadius: 3, overflow: 'hidden'},
  barGrad: {flex: 1},
  loading: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: '#9DCEDB',
  },
});

export default LoaderScreen;
