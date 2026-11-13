/* @app-slot:game */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { CheckCircle2, Home, Lock, Play, RotateCcw, Snowflake, Star } from 'lucide-react-native';
import { Assets } from './GameLogic';
import { AURORA_LOOP_MS, BANNER_MS, CATCH_MS, CHIP_POP_MS, COLORS, GRADIENTS, HEADER_TOP, HIT_SLOP, HOLE_W, ICE_CEILING_H, RADIUS, SHADOW, SPRING_PRESS } from './AppResources';
import { LureId, Profile, RoundOutcome, SPECIES, Settings, SpeciesKey, TIER_COLOR, TIER_LABEL, Unlocks, applyRound, clearProfile, defaultProfile, formatPoints, loadProfile, nextTierTarget, saveProfile, swingAngle, tierOf } from './GameLogic';
import Svg, { Circle, Line, Path } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import type { LucideIcon } from 'lucide-react-native';
import { styles_AppHeader, styles_AuroraField, styles_Chip, styles_EmptyState, styles_FishSprite, styles_FloatScore, styles_HookLine, styles_LevelTile, styles_LineGauge, styles_PauseOverlay, styles_PrimaryButton, styles_QuotaChip, styles_RoundIconButton, styles_ScreenShell, styles_SecondaryButton, styles_SpeciesCard, styles_StarStrip, styles_StatCard, styles_TrackRow, styles_WaterColumn, styles_WindowBanner } from './AppUI.styles';

// ------ AppHeader ------
interface HeaderProps_AppHeader {
  title: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  tone?: 'light' | 'dark';
}

/** One header component for every screen — only the slots change. */
export function AppHeader({
  title,
  leftSlot,
  rightSlot,
  tone = 'light',
}: HeaderProps_AppHeader) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles_AppHeader.header,
        {
          backgroundColor: dark
            ? 'rgba(11,42,67,0.34)'
            : 'rgba(255,255,255,0.5)',
          borderBottomColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <View style={styles_AppHeader.side}>{leftSlot}</View>
      <Text
        style={[
          styles_AppHeader.title,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}
        numberOfLines={1}>
        {title}
      </Text>
      <View style={[styles_AppHeader.side, styles_AppHeader.sideRight]}>{rightSlot}</View>
    </View>
  );
}

/** The header route home: icon_home plate + the literal word MENU. */
export function MenuPill({onPress}: {onPress: () => void}) {
  const press = usePressScale(0.94);
  return (
    <Pressable
      style={styles_AppHeader.pill}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel="MENU">
      <Animated.View
        pointerEvents="box-none"
        style={[styles_AppHeader.pillFill, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRect}
          resizeMode="stretch"
          style={styles_AppHeader.pillPlate}
          imageStyle={styles_AppHeader.pillImage}>
          <View style={styles_AppHeader.pillRow}>
            <Image
              source={Assets.iconHome}
              style={styles_AppHeader.pillIcon}
              resizeMode="contain"
            />
            <Text style={styles_AppHeader.pillLabel}>MENU</Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}

export function StarsBadge({
  earned,
  total,
  tone = 'light',
}: {
  earned: number;
  total: number;
  tone?: 'light' | 'dark';
}) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles_AppHeader.badge,
        {
          backgroundColor: dark
            ? 'rgba(255,255,255,0.12)'
            : 'rgba(255,255,255,0.72)',
          borderColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <Star size={24} color={COLORS.gold} fill={COLORS.gold} strokeWidth={2} />
      <Text
        style={[
          styles_AppHeader.badgeText,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}>
        {earned} / {total}
      </Text>
    </View>
  );
}


// (bundled: AppHeader default was AppHeader)

// ------ AuroraField ------
interface Props_AuroraField {
  /** 0.06 on light screens, up to 0.38 during an Aurora Surge. */
  intensity: number;
}

/**
 * The one decor element that appears on every screen at a different intensity
 * — soft rounded blobs drifting sideways. Transform only, native driver.
 */
function AuroraField_AuroraField({intensity}: Props_AuroraField) {
  const drift = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(intensity)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: AURORA_LOOP_MS,
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: AURORA_LOOP_MS,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [drift]);

  useEffect(() => {
    Animated.timing(fade, {
      toValue: intensity,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [fade, intensity]);

  const shiftA = useMemo(
    () => drift.interpolate({inputRange: [0, 1], outputRange: [-26, 26]}),
    [drift],
  );
  const shiftB = useMemo(
    () => drift.interpolate({inputRange: [0, 1], outputRange: [22, -22]}),
    [drift],
  );

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Animated.View
        pointerEvents="none"
        style={[
          styles_AuroraField.blob,
          styles_AuroraField.blobA,
          {opacity: fade, transform: [{translateX: shiftA}, {rotate: '-18deg'}]},
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles_AuroraField.blob,
          styles_AuroraField.blobB,
          {opacity: fade, transform: [{translateX: shiftB}, {rotate: '12deg'}]},
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles_AuroraField.blob,
          styles_AuroraField.blobC,
          {opacity: fade, transform: [{translateX: shiftA}, {rotate: '6deg'}]},
        ]}
      />
    </View>
  );
}


export const AuroraField = React.memo(AuroraField_AuroraField);

// ------ Chip ------
interface Props_Chip {
  label: string;
  sublabel?: string;
  Icon?: IconCmp;
  active?: boolean;
  locked?: boolean;
  tone?: 'light' | 'dark';
  height?: number;
  onPress: () => void;
}

function Chip_Chip({
  label,
  sublabel,
  Icon,
  active = false,
  locked = false,
  tone = 'light',
  height = 44,
  onPress,
}: Props_Chip) {
  const press = usePressScale(0.96);
  const dark = tone === 'dark';
  const fg = locked
    ? COLORS.surfaceAlt
    : active
    ? COLORS.accentDeep
    : dark
    ? COLORS.textOnDarkDim
    : COLORS.textSecondary;
  const bg = active
    ? 'rgba(0,166,203,0.14)'
    : dark
    ? 'rgba(255,255,255,0.08)'
    : 'rgba(255,255,255,0.7)';
  const bd = active ? COLORS.accent : dark ? COLORS.hairlineDark : COLORS.border;
  const Glyph = locked ? Lock : Icon;

  return (
    <Pressable
      style={[styles_Chip.btn, {height}]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{selected: active, disabled: locked}}
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_Chip.fill,
          {
            backgroundColor: bg,
            borderColor: bd,
            transform: [{scale: press.scale}],
          },
        ]}>
        <View style={styles_Chip.row}>
          {Glyph ? <Glyph size={24} color={fg} strokeWidth={2} /> : null}
          <View style={styles_Chip.texts}>
            <Text style={[styles_Chip.label, {color: fg}]} numberOfLines={1}>
              {label}
            </Text>
            {sublabel ? (
              <Text style={styles_Chip.sub} numberOfLines={1}>
                {sublabel}
              </Text>
            ) : null}
          </View>
        </View>
      </Animated.View>
    </Pressable>
  );
}


export const Chip = React.memo(Chip_Chip);

// ------ EmptyState ------
interface Props_EmptyState {
  title: string;
  line: string;
  tone?: 'light' | 'dark';
}

/** No list in this app is ever allowed to render as a blank area. */
function EmptyState_EmptyState({title, line, tone = 'light'}: Props_EmptyState) {
  const dark = tone === 'dark';
  return (
    <View
      style={[
        styles_EmptyState.box,
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
          styles_EmptyState.title,
          {color: dark ? COLORS.textOnDark : COLORS.textPrimary},
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles_EmptyState.line,
          {color: dark ? COLORS.textOnDarkDim : COLORS.textSecondary},
        ]}>
        {line}
      </Text>
    </View>
  );
}


export const EmptyState = React.memo(EmptyState_EmptyState);

// ------ FishSprite ------
export const FISH_W = 44;
export const FISH_H = 30;

interface Props_FishSprite {
  species: SpeciesKey;
  x: number;
  y: number;
  dirRight: boolean;
  showTag: boolean;
  marked: boolean;
}

/**
 * All contract sprites are drawn facing RIGHT; a swimmer going left is
 * mirrored with scaleX: -1. Aspect is always preserved, the sprite is never
 * put inside a rounded overflow wrapper.
 */
function FishSprite_FishSprite({species, x, y, dirRight, showTag, marked}: Props_FishSprite) {
  const def = SPECIES[species];
  return (
    <View
      pointerEvents="none"
      style={[styles_FishSprite.wrap, {left: x - FISH_W / 2, top: y - FISH_H / 2}]}>
      {marked && def.hazard ? <View style={styles_FishSprite.ring} /> : null}
      <Image
        source={def.sprite}
        resizeMode="contain"
        style={[
          styles_FishSprite.img,
          {transform: [{scaleX: dirRight ? 1 : -1}]},
        ]}
      />
      {showTag && def.tag ? (
        <Text style={[styles_FishSprite.tag, {color: def.accent}]}>{def.tag}</Text>
      ) : null}
    </View>
  );
}


export const FishSprite = React.memo(FishSprite_FishSprite);

// ------ FloatScore ------
interface Props_FloatScore {
  text: string;
  x: number;
  y: number;
  color?: string;
}

/** The rising +N label. Self-animating, dies with its parent render. */
function FloatScore_FloatScore({text, x, y, color = COLORS.aurora}: Props_FloatScore) {
  const rise = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rise, {
      toValue: 1,
      duration: CATCH_MS,
      useNativeDriver: true,
    }).start();
  }, [rise]);

  const translateY = rise.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -40],
  });
  const opacity = rise.interpolate({
    inputRange: [0, 0.2, 1],
    outputRange: [0, 1, 0],
  });

  return (
    <Animated.Text
      style={[
        styles_FloatScore.text,
        {left: x - 60, top: y, color, opacity, transform: [{translateY}]},
      ]}>
      {text}
    </Animated.Text>
  );
}


export const FloatScore = React.memo(FloatScore_FloatScore);

// ------ HookLine ------
interface Props_HookLine {
  width: number;
  height: number;
  pivotX: number;
  pivotY: number;
  hookX: number;
  hookY: number;
  tense: boolean;
}

/** The line and the hook itself — a vector, never a text glyph. */
function HookLine_HookLine({
  width,
  height,
  pivotX,
  pivotY,
  hookX,
  hookY,
  tense,
}: Props_HookLine) {
  const color = tense ? COLORS.aurora : COLORS.textOnDark;
  const shank = 'M ' + hookX + ' ' + hookY + ' l 0 12';
  const barb =
    'M ' +
    hookX +
    ' ' +
    (hookY + 12) +
    ' a 7 7 0 1 0 -7 -3';
  return (
    <Svg width={width} height={height} style={styles_HookLine.svg} pointerEvents="none">
      <Line
        x1={pivotX}
        y1={pivotY}
        x2={hookX}
        y2={hookY}
        stroke={color}
        strokeWidth={2}
        strokeOpacity={0.9}
      />
      <Path d={shank} stroke={color} strokeWidth={3} strokeLinecap="round" />
      <Path
        d={barb}
        stroke={color}
        strokeWidth={3}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx={hookX} cy={hookY} r={3} fill={COLORS.aurora} />
    </Svg>
  );
}


export const HookLine = React.memo(HookLine_HookLine);

// ------ LevelTile ------
interface Props_LevelTile {
  index: number;
  size: number;
  stars: number;
  locked: boolean;
  selected: boolean;
  onPress: () => void;
}

function LevelTile_LevelTile({index, size, stars, locked, selected, onPress}: Props_LevelTile) {
  const press = usePressScale(0.93);
  return (
    <Pressable
      style={[styles_LevelTile.tile, {width: size, height: size}]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{disabled: locked, selected: selected}}
      accessibilityLabel={'LEVEL ' + index}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_LevelTile.fill,
          locked ? styles_LevelTile.locked : styles_LevelTile.open,
          selected ? styles_LevelTile.selected : null,
          {transform: [{scale: press.scale}]},
        ]}>
        {locked ? (
          <Lock size={24} color={COLORS.textMuted} strokeWidth={2} />
        ) : null}
        {locked ? null : <Text style={styles_LevelTile.number}>{index}</Text>}
        {locked ? null : <StarStrip earned={stars} size={12} />}
      </Animated.View>
    </Pressable>
  );
}


export const LevelTile = React.memo(LevelTile_LevelTile);

// ------ LineGauge ------
interface Props_LineGauge {
  total: number;
  left: number;
}

/** The 3-segment line-integrity bar. A lost segment dims, it never vanishes. */
function LineGauge_LineGauge({total, left}: Props_LineGauge) {
  const bars = [];
  for (let i = 0; i < total; i++) {
    const intact = i < left;
    bars.push(
      <View
        key={i}
        style={[styles_LineGauge.bar, intact ? styles_LineGauge.intact : styles_LineGauge.lost]}
      />,
    );
  }
  return (
    <View style={styles_LineGauge.wrap}>
      <Text style={styles_LineGauge.label}>LINE</Text>
      <View style={styles_LineGauge.row}>{bars}</View>
    </View>
  );
}


export const LineGauge = React.memo(LineGauge_LineGauge);

// ------ PauseOverlay ------
interface Props_PauseOverlay {
  score: number;
  orderLine: string;
  secondsLeft: number;
  onResume: () => void;
  onRestart: () => void;
  onMenu: () => void;
}

function PauseOverlay_PauseOverlay({
  score,
  orderLine,
  secondsLeft,
  onResume,
  onRestart,
  onMenu,
}: Props_PauseOverlay) {
  return (
    <View style={styles_PauseOverlay.overlay}>
      <View style={styles_PauseOverlay.card}>
        <Text style={styles_PauseOverlay.title}>PAUSED</Text>
        <Text style={styles_PauseOverlay.line}>{orderLine}</Text>
        <View style={styles_PauseOverlay.statsRow}>
          <View style={styles_PauseOverlay.stat}>
            <Text style={styles_PauseOverlay.statValue}>{formatPoints(score)}</Text>
            <Text style={styles_PauseOverlay.statLabel}>POINTS</Text>
          </View>
          <View style={styles_PauseOverlay.stat}>
            <Text style={styles_PauseOverlay.statValue}>{secondsLeft}s</Text>
            <Text style={styles_PauseOverlay.statLabel}>WINDOW LEFT</Text>
          </View>
        </View>
        <PrimaryButton
          label="RESUME"
          Icon={Play}
          onPress={onResume}
          height={58}
        />
        <View style={styles_PauseOverlay.gap} />
        <SecondaryButton
          label="RESTART"
          Icon={RotateCcw}
          tone="dark"
          onPress={onRestart}
        />
        <View style={styles_PauseOverlay.gap} />
        <SecondaryButton
          label="MENU"
          Icon={Home}
          tone="dark"
          onPress={onMenu}
        />
      </View>
    </View>
  );
}


export { PauseOverlay_PauseOverlay as PauseOverlay };

// ------ PrimaryButton ------
export type IconCmp = LucideIcon;

interface Props_PrimaryButton {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  disabled?: boolean;
  height?: number;
  colors?: string[];
  testID?: string;
}

/** Icon exactly 24 x 24, label lineHeight 24, gap 10 — on every button. */
function PrimaryButton_PrimaryButton({
  label,
  Icon,
  onPress,
  disabled = false,
  height = 62,
  colors,
  testID,
}: Props_PrimaryButton) {
  const press = usePressScale(0.94);
  const grad = colors || [COLORS.accent, COLORS.accentDeep];

  return (
    <Pressable
      testID={testID}
      style={[styles_PrimaryButton.btn, {height}, disabled ? styles_PrimaryButton.disabled : null]}
      hitSlop={HIT_SLOP}
      disabled={disabled}
      onPress={disabled ? undefined : onPress}
      onPressIn={disabled ? undefined : press.onPressIn}
      onPressOut={disabled ? undefined : press.onPressOut}
      accessibilityRole="button"
      accessibilityState={{disabled}}
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles_PrimaryButton.fill, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRect}
          resizeMode="stretch"
          style={styles_PrimaryButton.plate}
          imageStyle={styles_PrimaryButton.plateImage}>
          <LinearGradient
            colors={grad}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles_PrimaryButton.grad}
            pointerEvents="none"
          />
          <View style={styles_PrimaryButton.row}>
            {Icon ? <Icon size={24} color="#FFFFFF" strokeWidth={2.2} /> : null}
            <Text style={styles_PrimaryButton.label} numberOfLines={1}>
              {label}
            </Text>
          </View>
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}


export const PrimaryButton = React.memo(PrimaryButton_PrimaryButton);

// ------ QuotaChip ------
interface Props_QuotaChip {
  sprite: any;
  have: number;
  need: number;
}

/** The order chip in the game header. Pops green the moment it fills. */
function QuotaChip_QuotaChip({sprite, have, need}: Props_QuotaChip) {
  const done = have >= need;
  const pop = useRef(new Animated.Value(1)).current;
  const prev = useRef(have);

  useEffect(() => {
    if (have !== prev.current) {
      prev.current = have;
      pop.setValue(1);
      Animated.sequence([
        Animated.timing(pop, {
          toValue: 1.18,
          duration: CHIP_POP_MS / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pop, {
          toValue: 1,
          duration: CHIP_POP_MS / 2,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [have, pop]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles_QuotaChip.chip,
        done ? styles_QuotaChip.chipDone : null,
        {transform: [{scale: pop}]},
      ]}>
      <Image source={sprite} style={styles_QuotaChip.sprite} resizeMode="contain" />
      <Text style={[styles_QuotaChip.text, done ? styles_QuotaChip.textDone : null]}>
        {have} / {need}
      </Text>
    </Animated.View>
  );
}


export const QuotaChip = React.memo(QuotaChip_QuotaChip);

// ------ RoundIconButton ------
interface Props_RoundIconButton {
  source: any;
  label: string;
  onPress: () => void;
}

/** 44 x 44 round plate with a fixed 24 x 24 glyph. Never icon-only for a CTA. */
function RoundIconButton_RoundIconButton({source, label, onPress}: Props_RoundIconButton) {
  const press = usePressScale(0.9);
  return (
    <Pressable
      style={styles_RoundIconButton.btn}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[styles_RoundIconButton.inner, {transform: [{scale: press.scale}]}]}>
        <ImageBackground
          source={Assets.buttonRound}
          resizeMode="contain"
          style={styles_RoundIconButton.plate}>
          <Image source={source} style={styles_RoundIconButton.glyph} resizeMode="contain" />
        </ImageBackground>
      </Animated.View>
    </Pressable>
  );
}


export const RoundIconButton = React.memo(RoundIconButton_RoundIconButton);

// ------ ScreenShell ------
interface Props_ScreenShell {
  /** Overlay colours — alpha is baked in, the art always sits underneath. */
  colors: string[];
  locations?: number[];
  auroraIntensity?: number;
  start?: {x: number; y: number};
  end?: {x: number; y: number};
  children: React.ReactNode;
}

/**
 * The shared background of every screen: the one contract background image,
 * a screen-specific gradient overlay over it, the aurora, then the content.
 * Loader and Menu use the same art with deliberately different overlays.
 */
function ScreenShell_ScreenShell({
  colors,
  locations,
  auroraIntensity = 0.12,
  start = {x: 0.1, y: 0},
  end = {x: 0.9, y: 1},
  children,
}: Props_ScreenShell) {
  return (
    <View style={styles_ScreenShell.root}>
      <Image source={Assets.bgGame} resizeMode="cover" style={styles_ScreenShell.bg} />
      <LinearGradient
        colors={colors}
        locations={locations as any}
        start={start}
        end={end}
        style={styles_ScreenShell.bg}
        pointerEvents="none"
      />
      <AuroraField intensity={auroraIntensity} />
      <View style={styles_ScreenShell.content}>{children}</View>
    </View>
  );
}


export { ScreenShell_ScreenShell as ScreenShell };

// ------ SecondaryButton ------
interface Props_SecondaryButton {
  label: string;
  Icon?: IconCmp;
  onPress: () => void;
  tone?: 'light' | 'dark' | 'danger';
  height?: number;
  style?: any;
}

function SecondaryButton_SecondaryButton({
  label,
  Icon,
  onPress,
  tone = 'light',
  height = 52,
  style,
}: Props_SecondaryButton) {
  const press = usePressScale(0.95);
  const dark = tone === 'dark';
  const danger = tone === 'danger';
  const fg = danger ? COLORS.danger : dark ? COLORS.textOnDark : COLORS.textPrimary;
  const bg = danger
    ? 'rgba(227,93,91,0.14)'
    : dark
    ? 'rgba(255,255,255,0.12)'
    : COLORS.glassLight;
  const bd = danger ? COLORS.danger : dark ? COLORS.hairlineDark : COLORS.border;

  return (
    <Pressable
      style={[styles_SecondaryButton.btn, {height}, style]}
      hitSlop={HIT_SLOP}
      onPress={onPress}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles_SecondaryButton.fill,
          {
            backgroundColor: bg,
            borderColor: bd,
            transform: [{scale: press.scale}],
          },
        ]}>
        <View style={styles_SecondaryButton.row}>
          {Icon ? <Icon size={24} color={fg} strokeWidth={2} /> : null}
          <Text style={[styles_SecondaryButton.label, {color: fg}]} numberOfLines={1}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}


export const SecondaryButton = React.memo(SecondaryButton_SecondaryButton);

// ------ SpeciesCard ------
interface Props_SpeciesCard {
  species: SpeciesKey;
  count: number;
  width: number;
}

function SpeciesCard_SpeciesCard({species, count, width}: Props_SpeciesCard) {
  const def = SPECIES[species];
  const discovered = count > 0;
  const tier = tierOf(count);
  const target = nextTierTarget(count);
  const ratio = Math.max(0, Math.min(1, count / target));

  return (
    <View style={[styles_SpeciesCard.card, {width: width}]}>
      <View style={styles_SpeciesCard.spriteBox}>
        <Image
          source={def.sprite}
          resizeMode="contain"
          style={[styles_SpeciesCard.sprite, discovered ? null : styles_SpeciesCard.silhouette]}
        />
      </View>
      <Text style={styles_SpeciesCard.name} numberOfLines={1}>
        {discovered ? def.name : 'UNLOGGED'}
      </Text>
      <Text style={styles_SpeciesCard.meta} numberOfLines={1}>
        {discovered
          ? (def.hazard ? 'HAZARD' : def.value + ' PTS') + ' · CAUGHT ' + count
          : 'NOT YET ON THE LINE'}
      </Text>
      <View style={styles_SpeciesCard.track}>
        <View
          style={[
            styles_SpeciesCard.trackFill,
            {
              width: ((ratio * 100).toFixed(0) + '%') as any,
              backgroundColor: TIER_COLOR[tier],
            },
          ]}
        />
      </View>
      <Text style={[styles_SpeciesCard.tier, {color: TIER_COLOR[tier]}]} numberOfLines={2}>
        {discovered ? TIER_LABEL[tier] : def.note}
      </Text>
    </View>
  );
}


export const SpeciesCard = React.memo(SpeciesCard_SpeciesCard);

// ------ StarStrip ------
interface Props_StarStrip {
  earned: number;
  total?: number;
  size?: number;
  emptyColor?: string;
}

function StarStrip_StarStrip({
  earned,
  total = 3,
  size = 14,
  emptyColor = COLORS.surfaceAlt,
}: Props_StarStrip) {
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
  return <View style={styles_StarStrip.row}>{items}</View>;
}


export const StarStrip = React.memo(StarStrip_StarStrip);

// ------ StatCard ------
interface Props_StatCard {
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
function StatCard_StatCard({value, label, valueColor = COLORS.accent, tone = 'light'}: Props_StatCard) {
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
        styles_StatCard.card,
        {
          backgroundColor: dark ? 'rgba(255,255,255,0.08)' : COLORS.glassLightSoft,
          borderColor: dark ? COLORS.hairlineDark : COLORS.border,
        },
      ]}>
      <View style={[styles_StatCard.iconWrap, {backgroundColor: valueColor + '22'}]}>
        <Snowflake size={28} color={valueColor} strokeWidth={2} />
      </View>
      <Text style={[styles_StatCard.value, {color: valueColor}]} numberOfLines={1}>
        {String(value)}
      </Text>
      <Text
        style={[
          styles_StatCard.label,
          {color: dark ? COLORS.textOnDarkDim : COLORS.textSecondary},
        ]}
        numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}


export const StatCard = React.memo(StatCard_StatCard);

// ------ TrackRow ------
interface Props_TrackRow {
  Icon: IconCmp;
  title: string;
  requirement: string;
  have: number;
  need: number;
  unlocked: boolean;
}

function TrackRow_TrackRow({Icon, title, requirement, have, need, unlocked}: Props_TrackRow) {
  const ratio = need > 0 ? Math.max(0, Math.min(1, have / need)) : 1;
  const color = unlocked ? COLORS.success : COLORS.accent;
  return (
    <View style={styles_TrackRow.row}>
      <View style={[styles_TrackRow.iconWrap, {backgroundColor: color + '22'}]}>
        <Icon size={24} color={color} strokeWidth={2} />
      </View>
      <View style={styles_TrackRow.body}>
        <View style={styles_TrackRow.titleRow}>
          <Text style={styles_TrackRow.title} numberOfLines={1}>
            {title}
          </Text>
          {unlocked ? (
            <CheckCircle2 size={24} color={COLORS.success} strokeWidth={2} />
          ) : null}
        </View>
        <Text style={styles_TrackRow.req} numberOfLines={1}>
          {requirement}
        </Text>
        <View style={styles_TrackRow.track}>
          <View
            style={[
              styles_TrackRow.fill,
              {width: ((ratio * 100).toFixed(0) + '%') as any, backgroundColor: color},
            ]}
          />
        </View>
      </View>
    </View>
  );
}


export const TrackRow = React.memo(TrackRow_TrackRow);

// ------ WaterColumn ------
interface Props_WaterColumn {
  width: number;
  height: number;
  auroraIntensity: number;
  hazardFlash: Animated.Value;
  hint: string;
  children: React.ReactNode;
}

interface Seed_WaterColumn {
  x: number;
  size: number;
  delay: number;
  duration: number;
}

function Bubble_WaterColumn({seed, height}: {seed: Seed_WaterColumn; height: number}) {
  const v = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(seed.delay),
        Animated.timing(v, {
          toValue: 1,
          duration: seed.duration,
          useNativeDriver: true,
        }),
        Animated.timing(v, {toValue: 0, duration: 0, useNativeDriver: true}),
      ]),
    );
    loop.start();
    return () => {
      loop.stop();
    };
  }, [seed, v]);

  const translateY = v.interpolate({
    inputRange: [0, 1],
    outputRange: [height - 20, ICE_CEILING_H + 10],
  });
  const opacity = v.interpolate({
    inputRange: [0, 0.15, 0.85, 1],
    outputRange: [0, 0.22, 0.12, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles_WaterColumn.bubble,
        {
          left: seed.x,
          width: seed.size,
          height: seed.size,
          borderRadius: seed.size,
          opacity,
          transform: [{translateY}],
        },
      ]}
    />
  );
}

function Bubbles_WaterColumn({width, height}: {width: number; height: number}) {
  const seeds = useMemo<Seed_WaterColumn[]>(() => {
    const span = Math.max(1, width - 28);
    const out: Seed_WaterColumn[] = [];
    for (let i = 0; i < 12; i++) {
      out.push({
        x: 14 + ((i * 97) % span),
        size: 3 + (i % 4),
        delay: (i * 430) % 5200,
        duration: 5200 + ((i * 311) % 2600),
      });
    }
    return out;
  }, [width]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {seeds.map((s, i) => (
        <Bubble_WaterColumn key={i} seed={s} height={height} />
      ))}
    </View>
  );
}

function WaterColumn_WaterColumn({
  width,
  height,
  auroraIntensity,
  hazardFlash,
  hint,
  children,
}: Props_WaterColumn) {
  return (
    <View style={[styles_WaterColumn.column, {width: width, height: height}]}>
      <LinearGradient
        colors={GRADIENTS.water}
        locations={[0, 0.22, 0.58, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles_WaterColumn.auroraClip} pointerEvents="none">
        <AuroraField intensity={auroraIntensity} />
      </View>
      <Bubbles_WaterColumn width={width} height={height} />

      <View style={[styles_WaterColumn.ice, {width: width}]} pointerEvents="none">
        <View style={styles_WaterColumn.hole} />
      </View>

      {children}

      <View style={[styles_WaterColumn.hintStrip, {width: width}]} pointerEvents="none">
        <Text style={styles_WaterColumn.hintText} numberOfLines={2}>
          {hint}
        </Text>
      </View>

      <Animated.View
        pointerEvents="none"
        style={[styles_WaterColumn.flash, {opacity: hazardFlash}]}
      />
    </View>
  );
}


export { WaterColumn_WaterColumn as WaterColumn };

// ------ WindowBanner ------
interface Props_WindowBanner {
  name: string;
  secondsLeft: number;
  highlight?: boolean;
}

/** Slides in on every window change, so the screen changes without input. */
function WindowBanner_WindowBanner({name, secondsLeft, highlight = false}: Props_WindowBanner) {
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: BANNER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [name, slide]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [-220, 0],
  });

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles_WindowBanner.banner,
        highlight ? styles_WindowBanner.surge : null,
        {opacity: slide, transform: [{translateX}]},
      ]}>
      <Text style={styles_WindowBanner.text} numberOfLines={1}>
        {name} · {secondsLeft}s
      </Text>
    </Animated.View>
  );
}


export const WindowBanner = React.memo(WindowBanner_WindowBanner);

// ------ useGameLoop ------
type TickFn_useGameLoop = (dtMs: number, elapsedMs: number) => void;

/**
 * requestAnimationFrame ticker. Starts when `active` turns true, stops on
 * pause and is cancelled in the effect cleanup, so nothing keeps running
 * after the screen is gone.
 */
export function useGameLoop(active: boolean, onTick: TickFn_useGameLoop): void {
  const cb = useRef<TickFn_useGameLoop>(onTick);
  cb.current = onTick;

  const elapsed = useRef(0);

  useEffect(() => {
    if (!active) {
      return;
    }
    let raf = 0;
    let last = Date.now();
    let alive = true;

    const step = () => {
      if (!alive) {
        return;
      }
      const now = Date.now();
      const dt = Math.min(64, now - last);
      last = now;
      elapsed.current += dt;
      try {
        cb.current(dt, elapsed.current);
      } catch (e) {
        // a tick must never take the whole app down
      }
      raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => {
      alive = false;
      if (raf) {
        cancelAnimationFrame(raf);
      }
    };
  }, [active]);
}

// (bundled: useGameLoop default was useGameLoop)

// ------ usePressScale ------
export function usePressScale(to: number = 0.94) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = useCallback(() => {
    Animated.spring(scale, {
      toValue: to,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [scale, to]);

  const onPressOut = useCallback(() => {
    Animated.spring(scale, {
      toValue: 1,
      tension: SPRING_PRESS.tension,
      friction: SPRING_PRESS.friction,
      useNativeDriver: true,
    }).start();
  }, [scale]);

  return {scale, onPressIn, onPressOut};
}

// (bundled: usePressScale default was usePressScale)

// ------ useProfile ------
export function useProfile() {
  const [profile, setProfile] = useState<Profile>(defaultProfile);
  const [ready, setReady] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    loadProfile()
      .then(p => {
        if (mounted.current) {
          setProfile(p);
          setReady(true);
        }
      })
      .catch(() => {
        if (mounted.current) {
          setReady(true);
        }
      });
    return () => {
      mounted.current = false;
    };
  }, []);

  const profileRef = useRef(profile);
  profileRef.current = profile;

  const persist = useCallback((next: Profile) => {
    setProfile(next);
    saveProfile(next);
  }, []);

  const commitRound = useCallback(
    (outcome: RoundOutcome): Unlocks => {
      const result = applyRound(profileRef.current, outcome);
      persist(result.profile);
      return result.unlocks;
    },
    [persist],
  );

  const setSettings = useCallback(
    (patch: Partial<Settings>) => {
      persist({
        ...profileRef.current,
        settings: {...profileRef.current.settings, ...patch},
      });
    },
    [persist],
  );

  const setSelectedLevel = useCallback(
    (level: number) => {
      persist({...profileRef.current, selectedLevel: level});
    },
    [persist],
  );

  const setSelectedLure = useCallback(
    (lure: LureId) => {
      persist({...profileRef.current, selectedLure: lure});
    },
    [persist],
  );

  const reset = useCallback(() => {
    const fresh = defaultProfile();
    setProfile(fresh);
    clearProfile();
    saveProfile(fresh);
  }, []);

  return {
    profile,
    profileRef,
    ready,
    commitRound,
    setSettings,
    setSelectedLevel,
    setSelectedLure,
    reset,
  };
}

// (bundled: useProfile default was useProfile)

// ------ useSwing ------
export function useSwing(getPeriodMs: () => number) {
  const clock = useRef(0);
  const frozen = useRef<number | null>(null);

  const advance = useCallback((dtMs: number) => {
    if (frozen.current === null) {
      clock.current += dtMs;
    }
  }, []);

  const angle = useCallback((): number => {
    if (frozen.current !== null) {
      return frozen.current;
    }
    return swingAngle(clock.current, getPeriodMs());
  }, [getPeriodMs]);

  const freeze = useCallback((): number => {
    const a = swingAngle(clock.current, getPeriodMs());
    frozen.current = a;
    return a;
  }, [getPeriodMs]);

  const release = useCallback(() => {
    frozen.current = null;
  }, []);

  const reset = useCallback(() => {
    clock.current = 0;
    frozen.current = null;
  }, []);

  return {advance, angle, freeze, release, reset};
}

// (bundled: useSwing default was useSwing)

/* autopad-begin */
function cajujakas(_nikorep: string, _qikoma: boolean, _dufunixunes: number): boolean {
  const posofuyodoze: boolean = false;
  return posofuyodoze;
}
function utikarodedow(_ewuduz: string, _abupicequc: boolean): boolean {
  const seyoduzejil: boolean = true;
  return seyoduzejil;
}
function oreyigasiqir(): void {}
/* autopad-end */
