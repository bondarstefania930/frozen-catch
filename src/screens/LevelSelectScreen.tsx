import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Anchor, Play, ShieldCheck, Sparkles, Zap} from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import AppHeader, {MenuPill, StarsBadge} from '../components/AppHeader';
import Chip from '../components/Chip';
import LevelTile from '../components/LevelTile';
import PrimaryButton from '../components/PrimaryButton';
import EmptyState from '../components/EmptyState';
import {BOARD_FRAME, BOARD_MAX_W, GRID_GAP} from '../constants/config';
import {COLORS, RADIUS} from '../constants/theme';
import {LEVELS, ZONES, ZoneId, getLevel, quotaLabel} from '../game/levels';
import {LURES, LureId} from '../game/lures';
import {Profile, maxStars, starsOf, totalStars} from '../game/profile';
import type {IconCmp} from '../components/PrimaryButton';

interface Props {
  profile: Profile;
  onMenu: () => void;
  onSelectLevel: (level: number) => void;
  onSelectLure: (lure: LureId) => void;
  onStart: () => void;
}

const COLS = 4;
const TILE = Math.floor(
  (BOARD_MAX_W - 2 * BOARD_FRAME - GRID_GAP * (COLS - 1)) / COLS,
);

const LURE_ICONS: Record<LureId, IconCmp> = {
  bare: Anchor,
  glow: Sparkles,
  steel: ShieldCheck,
  quick: Zap,
};

function LevelSelectScreen({
  profile,
  onMenu,
  onSelectLevel,
  onSelectLure,
  onStart,
}: Props) {
  const stars = totalStars(profile);
  const selected = getLevel(profile.selectedLevel);
  const [zone, setZone] = useState<ZoneId>(selected.zone);
  const [notice, setNotice] = useState<string>('');

  const zoneLevels = useMemo(
    () => LEVELS.filter(l => l.zone === zone),
    [zone],
  );
  const openInZone = zoneLevels.filter(l => l.index <= profile.unlockedLevel);

  const pickZone = useCallback(
    (z: ZoneId) => {
      const first = LEVELS.filter(l => l.zone === z)[0];
      if (first.index > profile.unlockedLevel) {
        setNotice('CLEAR LEVEL ' + (first.index - 1) + ' TO OPEN THIS ZONE');
        return;
      }
      setNotice('');
      setZone(z);
    },
    [profile.unlockedLevel],
  );

  const pickLevel = useCallback(
    (index: number) => {
      if (index > profile.unlockedLevel) {
        setNotice('LEVEL ' + index + ' IS STILL UNDER THICK ICE');
        return;
      }
      setNotice('');
      onSelectLevel(index);
    },
    [onSelectLevel, profile.unlockedLevel],
  );

  const pickLure = useCallback(
    (id: LureId, needed: number) => {
      if (stars < needed) {
        setNotice(needed + ' STARS UNLOCK THIS LURE');
        return;
      }
      setNotice('');
      onSelectLure(id);
    },
    [onSelectLure, stars],
  );

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="LEVEL SELECT"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={<StarsBadge earned={stars} total={maxStars()} />}
      />

      <View style={styles.body}>
        <View style={styles.zoneRow}>
          {ZONES.map(z => (
            <Chip
              key={z.id}
              label={z.name}
              active={z.id === zone}
              locked={z.from > profile.unlockedLevel}
              height={40}
              onPress={() => pickZone(z.id)}
            />
          ))}
        </View>

        {openInZone.length === 0 ? (
          <EmptyState
            title="THE ICE HERE IS STILL TOO THICK"
            line="CLEAR THE ZONE BEFORE IT TO CUT A HOLE HERE"
          />
        ) : (
          <View style={styles.board}>
            <View style={styles.grid}>
              {zoneLevels.map(l => (
                <LevelTile
                  key={l.index}
                  index={l.index}
                  size={TILE}
                  stars={starsOf(profile, l.index)}
                  locked={l.index > profile.unlockedLevel}
                  selected={l.index === profile.selectedLevel}
                  onPress={() => pickLevel(l.index)}
                />
              ))}
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>LURE LOADOUT</Text>
        <View style={styles.lureGrid}>
          {LURES.map(l => (
            <View key={l.id} style={styles.lureCell}>
              <Chip
                label={l.name}
                sublabel={
                  stars < l.starsNeeded ? l.starsNeeded + ' STARS' : l.perk
                }
                Icon={LURE_ICONS[l.id]}
                active={profile.selectedLure === l.id}
                locked={stars < l.starsNeeded}
                height={48}
                onPress={() => pickLure(l.id, l.starsNeeded)}
              />
            </View>
          ))}
        </View>

        <View style={styles.spacer} />

        <Text style={styles.hint} numberOfLines={2}>
          {notice
            ? notice
            : 'LEVEL ' +
              selected.index +
              ' · ' +
              selected.name +
              ' · ORDER ' +
              quotaLabel(selected)}
        </Text>
        <PrimaryButton
          label="START LEVEL"
          Icon={Play}
          onPress={onStart}
          height={58}
        />
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20},
  zoneRow: {flexDirection: 'row', gap: 8},
  board: {
    marginTop: 14,
    alignSelf: 'center',
    padding: BOARD_FRAME - 2,
    borderWidth: 2,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
  grid: {flexDirection: 'row', gap: GRID_GAP},
  sectionTitle: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textSecondary,
    marginTop: 18,
    marginBottom: 8,
  },
  lureGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 8},
  lureCell: {width: '48%'},
  spacer: {flex: 1},
  hint: {
    fontSize: 12,
    lineHeight: 17,
    fontWeight: '600',
    letterSpacing: 0.9,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
});

export default LevelSelectScreen;
