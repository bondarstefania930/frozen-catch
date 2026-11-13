import React, {useEffect, useMemo, useRef} from 'react';
import {Animated, Image, StyleSheet, Text, View} from 'react-native';
import {BarChart3, BookOpen, LayoutGrid, Play, Settings} from 'lucide-react-native';
import Assets from '../assets';
import ScreenShell from '../components/ScreenShell';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import StatCard from '../components/StatCard';
import {StarsBadge} from '../components/AppHeader';
import {COLORS, HEADER_TOP, RADIUS, SHADOW} from '../constants/theme';
import {FADE_SCREEN_MS} from '../constants/config';
import {
  Profile,
  bestScoreOverall,
  maxStars,
  speciesDiscovered,
  totalStars,
} from '../game/profile';
import {LEVEL_COUNT, getLevel} from '../game/levels';
import {formatPoints} from '../game/scoring';
import {SPECIES_ORDER} from '../game/collection';

interface Props {
  profile: Profile;
  onPlay: () => void;
  onLevels: () => void;
  onCollection: () => void;
  onProgress: () => void;
  onSettings: () => void;
}

function MenuScreen({
  profile,
  onPlay,
  onLevels,
  onCollection,
  onProgress,
  onSettings,
}: Props) {
  const rise = useRef(new Animated.Value(28)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(rise, {
        toValue: 0,
        duration: 380,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: FADE_SCREEN_MS,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fade, rise]);

  const stars = totalStars(profile);
  const best = bestScoreOverall(profile);
  const species = speciesDiscovered(profile);
  const nextLevel = getLevel(profile.unlockedLevel);

  const cards = useMemo(() => {
    const list: Array<{key: string; value: string; label: string; color: string}> =
      [
        {
          key: 'levels',
          value: profile.unlockedLevel + ' / ' + LEVEL_COUNT,
          label: 'LEVELS OPEN',
          color: COLORS.accent,
        },
      ];
    if (best > 0) {
      list.push({
        key: 'best',
        value: formatPoints(best),
        label: 'BEST SCORE',
        color: COLORS.gold,
      });
    }
    if (species > 0) {
      list.push({
        key: 'species',
        value: species + ' / ' + SPECIES_ORDER.length,
        label: 'SPECIES LOGGED',
        color: COLORS.success,
      });
    }
    return list.slice(0, 3);
  }, [best, profile.unlockedLevel, species]);

  return (
    <ScreenShell
      colors={[
        'rgba(232,244,248,0.05)',
        'rgba(232,244,248,0.28)',
        'rgba(232,244,248,0.80)',
      ]}
      locations={[0, 0.38, 0.62]}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <View style={styles.topRow}>
        <View style={styles.logoRound}>
          <Image source={Assets.logo} resizeMode="contain" style={styles.logo} />
        </View>
        <StarsBadge earned={stars} total={maxStars()} />
      </View>

      <View style={styles.spacer} />

      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.sheet,
          {opacity: fade, transform: [{translateY: rise}]},
        ]}>
        <Text style={styles.title}>FROZEN CATCH</Text>
        <Text style={styles.tagline}>TIME THE SWING · READ THE WINDOW</Text>

        {cards.length >= 2 ? (
          <View style={styles.statRow}>
            {cards.map(c => (
              <View key={c.key} style={styles.statSlot}>
                <StatCard value={c.value} label={c.label} valueColor={c.color} />
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.firstRun}>
            <Text style={styles.firstRunText}>
              FIRST CUT IN THE ICE · LEVEL 1 IS OPEN
            </Text>
          </View>
        )}

        <Text style={styles.hint}>
          NEXT: LEVEL {nextLevel.index} · {nextLevel.name}
        </Text>

        <PrimaryButton label="PLAY NOW" Icon={Play} onPress={onPlay} />

        <View style={styles.grid}>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <SecondaryButton
                label="LEVELS"
                Icon={LayoutGrid}
                onPress={onLevels}
              />
            </View>
            <View style={styles.gridCell}>
              <SecondaryButton
                label="COLLECTION"
                Icon={BookOpen}
                onPress={onCollection}
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCell}>
              <SecondaryButton
                label="PROGRESS"
                Icon={BarChart3}
                onPress={onProgress}
              />
            </View>
            <View style={styles.gridCell}>
              <SecondaryButton
                label="SETTINGS"
                Icon={Settings}
                onPress={onSettings}
              />
            </View>
          </View>
        </View>
      </Animated.View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  topRow: {
    paddingTop: HEADER_TOP,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoRound: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {width: 32, height: 32},
  spacer: {flex: 1},
  sheet: {
    backgroundColor: 'rgba(242,251,255,0.94)',
    borderTopLeftRadius: RADIUS.xxl,
    borderTopRightRadius: RADIUS.xxl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    ...SHADOW.sheet,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 0.6,
    color: COLORS.textPrimary,
  },
  tagline: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statRow: {flexDirection: 'row', gap: 12, marginTop: 16},
  statSlot: {flex: 1},
  firstRun: {
    marginTop: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassLightSoft,
  },
  firstRunText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  hint: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textSecondary,
    marginTop: 14,
    marginBottom: 10,
  },
  grid: {marginTop: 14, gap: 10},
  gridRow: {flexDirection: 'row', gap: 10},
  gridCell: {flex: 1},
});

export default MenuScreen;
