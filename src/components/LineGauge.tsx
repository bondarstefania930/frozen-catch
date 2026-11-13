import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {COLORS} from '../constants/theme';

interface Props {
  total: number;
  left: number;
}

/** The 3-segment line-integrity bar. A lost segment dims, it never vanishes. */
function LineGauge({total, left}: Props) {
  const bars = [];
  for (let i = 0; i < total; i++) {
    const intact = i < left;
    bars.push(
      <View
        key={i}
        style={[styles.bar, intact ? styles.intact : styles.lost]}
      />,
    );
  }
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>LINE</Text>
      <View style={styles.row}>{bars}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {alignItems: 'flex-end'},
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  row: {flexDirection: 'row', gap: 4, marginTop: 3},
  bar: {width: 14, height: 5, borderRadius: 3},
  intact: {backgroundColor: COLORS.aurora},
  lost: {backgroundColor: COLORS.danger, opacity: 0.35},
});

export default React.memo(LineGauge);
