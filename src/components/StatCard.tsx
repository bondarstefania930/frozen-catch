import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Snowflake} from 'lucide-react-native';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';

interface Props {
  value: string | number;
  label: string;
  valueColor?: string;
  tone?: 'light' | 'dark';
}

/**
 * The single stat component used on Menu, Result and Progress. One icon for
 * every pill in a row — the colour, the value and the label carry the meaning.
 * Renders null when there is nothing to show, never an empty rounded box.
 */
function StatCard({value, label, valueColor = COLORS.accent, tone = 'light'}: Props) {
  const empty =
    value === 0 ||
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim().length === 0);
  if (empty) {
    return null;
  }
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: dark ? 'rgba(255,255,255,0.08)' : COLORS.glassLightSoft,
          borderColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <View style={[styles.iconWrap, {backgroundColor: valueColor + '22'}]}>
        <Snowflake size={28} color={valueColor} strokeWidth={2} />
      </View>
      <Text style={[styles.value, {color: valueColor}]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text
        style={[
          styles.label,
          {color: dark ? COLORS.textOnDarkDim : COLORS.textSecondary},
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    alignItems: 'center',
    ...SHADOW.card,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  value: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.1,
    marginTop: 2,
  },
});

export default React.memo(StatCard);
