import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Star} from 'lucide-react-native';
import {COLORS} from '../constants/theme';

interface Props {
  earned: number;
  total?: number;
  size?: number;
  emptyColor?: string;
}

function StarStrip({
  earned,
  total = 3,
  size = 14,
  emptyColor = COLORS.surfaceAlt,
}: Props) {
  const items = [];
  for (let i = 0; i < total; i++) {
    const on = i < earned;
    items.push(
      <Star
        key={i}
        size={size}
        color={on ? COLORS.gold : emptyColor}
        fill={on ? COLORS.gold : 'transparent'}
        strokeWidth={2}
      />,
    );
  }
  return <View style={styles.row}>{items}</View>;
}

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 3},
});

export default React.memo(StarStrip);
