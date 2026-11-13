import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {
  SPECIES,
  SpeciesKey,
  TIER_COLOR,
  TIER_LABEL,
  nextTierTarget,
  tierOf,
} from '../game/collection';
import {COLORS, RADIUS, SHADOW} from '../constants/theme';

interface Props {
  species: SpeciesKey;
  count: number;
  width: number;
}

function SpeciesCard({species, count, width}: Props) {
  const def = SPECIES[species];
  const discovered = count > 0;
  const tier = tierOf(count);
  const target = nextTierTarget(count);
  const ratio = Math.max(0, Math.min(1, count / target));

  return (
    <View style={[styles.card, {width: width}]}>
      <View style={styles.spriteBox}>
        <Image
          source={def.sprite}
          resizeMode="contain"
          style={[styles.sprite, discovered ? null : styles.silhouette]}
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {discovered ? def.name : 'UNLOGGED'}
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {discovered
          ? (def.hazard ? 'HAZARD' : def.value + ' PTS') + ' · CAUGHT ' + count
          : 'NOT YET ON THE LINE'}
      </Text>
      <View style={styles.track}>
        <View
          style={[
            styles.trackFill,
            {
              width: ((ratio * 100).toFixed(0) + '%') as any,
              backgroundColor: TIER_COLOR[tier],
            },
          ]}
        />
      </View>
      <Text style={[styles.tier, {color: TIER_COLOR[tier]}]} numberOfLines={2}>
        {discovered ? TIER_LABEL[tier] : def.note}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassLightSoft,
    padding: 10,
    alignItems: 'center',
    ...SHADOW.card,
  },
  spriteBox: {
    width: 64,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sprite: {width: 60, height: 44},
  silhouette: {opacity: 0.14, tintColor: COLORS.abyss},
  name: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  meta: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  track: {
    width: '100%',
    height: 5,
    borderRadius: 3,
    backgroundColor: COLORS.surfaceAlt,
    marginTop: 8,
    overflow: 'hidden',
  },
  trackFill: {height: 5, borderRadius: 3},
  tier: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 5,
    textAlign: 'center',
  },
});

export default React.memo(SpeciesCard);
