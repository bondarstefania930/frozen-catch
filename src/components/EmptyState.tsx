import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Snowflake} from 'lucide-react-native';
import {COLORS, RADIUS} from '../constants/theme';

interface Props {
  title: string;
  line: string;
  tone?: 'light' | 'dark';
}

/** No list in this app is ever allowed to render as a blank area. */
function EmptyState({title, line, tone = 'light'}: Props) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles.box,
        {
          backgroundColor: dark
            ? 'rgba(255,255,255,0.08)'
            : COLORS.glassLightSoft,
          borderColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <Snowflake size={28} color={COLORS.accent} strokeWidth={2} />
      <Text
        style={[
          styles.title,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.line,
          {color: dark ? COLORS.textOnDarkDim : COLORS.textSecondary},
        ]}>
        {line}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    gap: 6,
  },
  title: {fontSize: 15, lineHeight: 22, fontWeight: '800', letterSpacing: 1},
  line: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
});

export default React.memo(EmptyState);
