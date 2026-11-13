import React, {useEffect, useRef} from 'react';
import {Animated, Image, StyleSheet, Text} from 'react-native';
import {CHIP_POP_MS} from '../constants/config';
import {COLORS, RADIUS} from '../constants/theme';

interface Props {
  sprite: any;
  have: number;
  need: number;
}

/** The order chip in the game header. Pops green the moment it fills. */
function QuotaChip({sprite, have, need}: Props) {
  const done = have >= need;
  const pop = useRef(new Animated.Value(1)).current;
  const prev = useRef(have);

  useEffect(() => {
    if (have !== prev.current) {
      prev.current = have;
      pop.setValue(1);
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.18,
          duration: CHIP_POP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pop, {
          toValue: 1,
          duration: CHIP_POP_MS / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [have, pop]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.chip,
        done ? styles.chipDone : null,
        {transform: [{scale: pop}]},
      ]}>
      <Image source={sprite} style={styles.sprite} resizeMode="contain" />
      <Text style={[styles.text, done ? styles.textDone : null]}>
        {have} / {need}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  chipDone: {
    backgroundColor: 'rgba(47,191,145,0.28)',
    borderColor: COLORS.success,
  },
  sprite: {width: 20, height: 20},
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.textOnDark,
    fontVariant: ['tabular-nums'],
  },
  textDone: {color: COLORS.success},
});

export default React.memo(QuotaChip);
