import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {CheckCircle2} from 'lucide-react-native';
import {COLORS, RADIUS} from '../constants/theme';
import type {IconCmp} from './PrimaryButton';

interface Props {
  Icon: IconCmp;
  title: string;
  requirement: string;
  have: number;
  need: number;
  unlocked: boolean;
}

function TrackRow({Icon, title, requirement, have, need, unlocked}: Props) {
  const ratio = need > 0 ? Math.max(0, Math.min(1, have / need)) : 1;
  const color = unlocked ? COLORS.success : COLORS.accent;
  return (
    <View style={styles.row}>
      <View style={[styles.iconWrap, {backgroundColor: color + '22'}]}>
        <Icon size={24} color={color} strokeWidth={2} />
      </View>
      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {unlocked ? (
            <CheckCircle2 size={24} color={COLORS.success} strokeWidth={2} />
          ) : null}
        </View>
        <Text style={styles.req} numberOfLines={1}>
          {requirement}
        </Text>
        <View style={styles.track}>
          <View
            style={[
              styles.fill,
              {width: ((ratio * 100).toFixed(0) + '%') as any, backgroundColor: color},
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassLight,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {flex: 1},
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.textPrimary,
  },
  req: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
  },
  track: {
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.surfaceAlt,
    marginTop: 6,
    overflow: 'hidden',
  },
  fill: {height: 5, borderRadius: 3},
});

export default React.memo(TrackRow);
