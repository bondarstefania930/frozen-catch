import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Trash2} from 'lucide-react-native';
import ScreenShell from '../components/ScreenShell';
import AppHeader, {MenuPill} from '../components/AppHeader';
import Chip from '../components/Chip';
import SecondaryButton from '../components/SecondaryButton';
import {COLORS, RADIUS} from '../constants/theme';
import {
  PRODUCT_FOOTER,
  SWING_PERIODS,
  SwingSpeed,
} from '../constants/config';
import {Profile, Settings} from '../game/profile';
import {settingsModifier} from '../game/scoring';

interface Props {
  profile: Profile;
  onMenu: () => void;
  onChange: (patch: Partial<Settings>) => void;
  onReset: () => void;
}

const SWINGS: SwingSpeed[] = ['CALM', 'NORMAL', 'FAST'];

function SettingsScreen({profile, onMenu, onChange, onReset}: Props) {
  const s = profile.settings;
  const [armed, setArmed] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  const onResetPress = useCallback(() => {
    if (!armed) {
      setArmed(true);
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = setTimeout(() => setArmed(false), 4000);
      return;
    }
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setArmed(false);
    onReset();
    onMenu();
  }, [armed, onMenu, onReset]);

  const modifier = settingsModifier(s.swing, s.hazardMarkers);

  return (
    <ScreenShell
      colors={['rgba(232,244,248,0.92)', 'rgba(209,231,238,0.95)']}
      start={{x: 0.5, y: 0}}
      end={{x: 0.5, y: 1}}
      auroraIntensity={0.1}>
      <AppHeader title="SETTINGS" leftSlot={<MenuPill onPress={onMenu} />} />

      <View style={styles.body}>
        <View style={styles.block}>
          <Text style={styles.title}>SWING SPEED</Text>
          <Text style={styles.sub}>
            PENDULUM PERIOD {SWING_PERIODS[s.swing]} MS
          </Text>
          <View style={styles.row}>
            {SWINGS.map(v => (
              <Chip
                key={v}
                label={v}
                active={s.swing === v}
                height={44}
                onPress={() => onChange({swing: v})}
              />
            ))}
          </View>
          <Text style={styles.note}>
            FAST PAYS x1.10 · CURRENT SCORE MODIFIER x{modifier.toFixed(2)}
          </Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>HAZARD MARKERS</Text>
          <Text style={styles.sub}>
            A RED RING AROUND THE PIKE AND THE RELIC
          </Text>
          <View style={styles.row}>
            <Chip
              label="ON"
              active={s.hazardMarkers}
              height={44}
              onPress={() => onChange({hazardMarkers: true})}
            />
            <Chip
              label="OFF"
              active={!s.hazardMarkers}
              height={44}
              onPress={() => onChange({hazardMarkers: false})}
            />
          </View>
          <Text style={styles.note}>PLAYING WITHOUT MARKERS PAYS x1.05</Text>
        </View>

        <View style={styles.block}>
          <Text style={styles.title}>SPECIES TAGS</Text>
          <Text style={styles.sub}>
            THE LETTER C / P / G UNDER EVERY SWIMMER
          </Text>
          <View style={styles.row}>
            <Chip
              label="ON"
              active={s.speciesTags}
              height={44}
              onPress={() => onChange({speciesTags: true})}
            />
            <Chip
              label="OFF"
              active={!s.speciesTags}
              height={44}
              onPress={() => onChange({speciesTags: false})}
            />
          </View>
          <Text style={styles.note}>
            READ SPECIES WITHOUT RELYING ON COLOUR · NO SCORE EFFECT
          </Text>
        </View>

        <View style={styles.spacer} />

        <SecondaryButton
          label={armed ? 'TAP AGAIN TO CONFIRM' : 'RESET PROGRESS'}
          Icon={Trash2}
          tone="danger"
          height={52}
          onPress={onResetPress}
        />
        <Text style={styles.footer}>{PRODUCT_FOOTER}</Text>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {flex: 1, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20},
  block: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.glassLight,
    marginBottom: 10,
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textPrimary,
  },
  sub: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  row: {flexDirection: 'row', gap: 8, marginTop: 10},
  note: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.textMuted,
    marginTop: 8,
  },
  spacer: {flex: 1, minHeight: 8},
  footer: {
    fontSize: 10,
    lineHeight: 15,
    fontWeight: '600',
    letterSpacing: 1,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 12,
  },
});

export default SettingsScreen;
