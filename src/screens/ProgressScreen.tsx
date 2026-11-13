import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Anchor, Play, ShieldCheck, Sparkles, Zap} from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import AppHeader, {MenuPill, StarsBadge} from '../components/AppHeader';
import StatCard from '../components/StatCard';
import TrackRow from '../components/TrackRow';
import EmptyState from '../components/EmptyState';
import PrimaryButton from '../components/PrimaryButton';
import {COLORS, RADIUS} from '../constants/theme';
import {LEVEL_COUNT, ZONES} from '../game/levels';
import {LURES, LureId} from '../game/lures';
import {
  Profile,
  bestScoreOverall,
  maxStars,
  speciesDiscovered,
  totalStars,
} from '../game/profile';
import {SPECIES_ORDER} from '../game/collection';
import {formatPoints} from '../game/scoring';
import type {IconCmp} from '../components/PrimaryButton';

interface Props {
  profile: Profile;
  onMenu: () => void;
  onPlay: () => void;
}

const LURE_ICONS: Record<LureId, IconCmp> = {
  bare: Anchor,
  glow: Sparkles,
  steel: ShieldCheck,
  quick: Zap,
};

function ProgressScreen({profile, onMenu, onPlay}: Props) {
  const stars = totalStars(profile);
  const best = bestScoreOverall(profile);
  const species = speciesDiscovered(profile);
  const fresh = profile.totalCatch === 0 && stars === 0 && best === 0;

  const tiles = useMemo(() => {
    const list: Array<{key: string; value: string; label: string; color: string}> =
      [];
    list.push({
      key: 'levels',
      value: profile.unlockedLevel + ' / ' + LEVEL_COUNT,
      label: 'LEVELS OPEN',
      color: COLORS.accent,
    });
    if (stars > 0) {
      list.push({
        key: 'stars',
        value: stars + ' / ' + maxStars(),
        label: 'STARS EARNED',
        color: COLORS.gold,
      });
    }
    if (profile.totalCatch > 0) {
      list.push({
        key: 'catch',
        value: formatPoints(profile.totalCatch),
        label: 'TOTAL CATCH',
        color: COLORS.success,
      });
    }
    if (best > 0) {
      list.push({
        key: 'best',
        value: formatPoints(best),
        label: 'BEST SCORE',
        color: COLORS.aurora,
      });
    }
    if (profile.bestStreak > 0) {
      list.push({
        key: 'streak',
        value: 'x' + profile.bestStreak,
        label: 'BEST STREAK',
        color: COLORS.danger,
      });
    }
    if (species > 0) {
      list.push({
        key: 'species',
        value: species + ' / ' + SPECIES_ORDER.length,
        label: 'SPECIES LOGGED',
        color: COLORS.accentDeep,
      });
    }
    return list;
  }, [best, profile.bestStreak, profile.totalCatch, profile.unlockedLevel, species, stars]);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="PROGRESS"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={<StarsBadge earned={stars} total={maxStars()} />}
      />

      <View style={styles.body}>
        {fresh ? (
          <View style={styles.freshWrap}>
            <EmptyState
              title="NOTHING ON THE LINE YET"
              line="CUT THE FIRST HOLE AND THE LOG STARTS FILLING ITSELF"
            />
            <View style={styles.freshCta}>
              <PrimaryButton
                label="PLAY NOW"
                Icon={Play}
                onPress={onPlay}
                height={58}
              />
            </View>
          </View>
        ) : null}

        {!fresh && tiles.length >= 2 ? (
          <View style={styles.grid}>
            {tiles.map(t => (
              <View key={t.key} style={styles.cell}>
                <StatCard value={t.value} label={t.label} valueColor={t.color} />
              </View>
            ))}
          </View>
        ) : null}

        {!fresh ? <Text style={styles.sectionTitle}>LURE TRACK</Text> : null}
        {!fresh
          ? LURES.filter(l => l.starsNeeded > 0).map(l => (
              <View key={l.id} style={styles.trackSlot}>
                <TrackRow
                  Icon={LURE_ICONS[l.id]}
                  title={l.name}
                  requirement={
                    stars >= l.starsNeeded
                      ? l.perk
                      : stars + ' / ' + l.starsNeeded + ' STARS'
                  }
                  have={stars}
                  need={l.starsNeeded}
                  unlocked={stars >= l.starsNeeded}
                />
              </View>
            ))
          : null}

        {!fresh ? <Text style={styles.sectionTitle}>ZONE BEST</Text> : null}
        {!fresh ? (
          <View style={styles.zoneRow}>
            {ZONES.map(z => (
              <View key={z.id} style={styles.zonePill}>
                <Text style={styles.zoneName} numberOfLines={1}>
                  {z.name}
                </Text>
                <Text style={styles.zoneValue} numberOfLines={1}>
                  {formatPoints(profile.zoneBest[z.id] || 0)}
                </Text>
              </View>
            ))}
          </View>
        ) : null}
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 12},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  cell: {width: '31.5%'},
  sectionTitle: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
    marginTop: 14,
    marginBottom: 8,
  },
  trackSlot: {marginBottom: 8},
  freshWrap: {flex: 1, justifyContent: 'center'},
  freshCta: {marginTop: 22, paddingHorizontal: 10},
  zoneRow: {flexDirection: 'row', gap: 8},
  zonePill: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassLight,
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 9,
    lineHeight: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
  },
  zoneValue: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '800',
    color: COLORS.accentDeep,
    fontVariant: ['tabular-nums'],
  },
});

export default ProgressScreen;
