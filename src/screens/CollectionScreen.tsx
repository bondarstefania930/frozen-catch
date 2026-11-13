import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import ScreenShell from '../components/ScreenShell';
import AppHeader, {MenuPill} from '../components/AppHeader';
import SpeciesCard from '../components/SpeciesCard';
import {BOARD_MAX_W} from '../constants/config';
import {COLORS, RADIUS} from '../constants/theme';
import {SPECIES_ORDER, tierOf} from '../game/collection';
import {Profile, speciesDiscovered} from '../game/profile';

interface Props {
  profile: Profile;
  onMenu: () => void;
}

const GAP = 12;
const CARD_W = Math.floor((BOARD_MAX_W - 24 - GAP) / 2);

function CollectionScreen({profile, onMenu}: Props) {
  const discovered = speciesDiscovered(profile);

  const master = useMemo(() => {
    const fish = ['char', 'perch', 'trout'] as const;
    for (let i = 0; i < fish.length; i++) {
      if (tierOf(profile.speciesCounts[fish[i]] || 0) !== 'gold') {
        return false;
      }
    }
    return true;
  }, [profile.speciesCounts]);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader
        title="ICE LOG"
        leftSlot={<MenuPill onPress={onMenu} />}
        rightSlot={
          <View style={styles.count}>
            <Text style={styles.countText}>
              {discovered} / {SPECIES_ORDER.length}
            </Text>
          </View>
        }
      />

      <View style={styles.body}>
        {master ? (
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>MASTER ANGLER</Text>
          </View>
        ) : (
          <Text style={styles.lead} numberOfLines={2}>
            EVERY SPECIES YOU LAND IS LOGGED HERE · 1 / 10 / 25 CATCHES RAISE
            ITS TIER AND ITS POINTS BONUS
          </Text>
        )}

        <View style={styles.grid}>
          {SPECIES_ORDER.map(key => (
            <SpeciesCard
              key={key}
              species={key}
              count={profile.speciesCounts[key] || 0}
              width={CARD_W}
            />
          ))}
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 12},
  count: {
    height: 44,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(255,255,255,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    color: COLORS.textPrimary,
    fontVariant: ['tabular-nums'],
  },
  lead: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  ribbon: {
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(242,193,78,0.22)',
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 12,
  },
  ribbonText: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.4,
    color: '#8A6410',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GAP,
    justifyContent: 'center',
  },
});

export default CollectionScreen;
