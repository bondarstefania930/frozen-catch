/* @app-slot:game */
import { StyleSheet } from 'react-native';
import { COLORS, HEADER_TOP, HOLE_W, ICE_CEILING_H, RADIUS, SHADOW } from './AppResources';

// ------ AppHeader ------
export const styles_AppHeader = StyleSheet.create({
  header: {
    paddingTop: HEADER_TOP,
    height: HEADER_TOP + 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  side: {width: 118, justifyContent: 'center'},
  sideRight: {alignItems: 'flex-end'},
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
  pill: {width: 112, height: 46},
  pillFill: {width: 112, height: 46},
  pillPlate: {
    width: 112,
    height: 46,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pillImage: {borderRadius: RADIUS.md, opacity: 0.85},
  pillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  pillIcon: {width: 24, height: 24},
  pillLabel: {
    fontSize: 13,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.accentDeep,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 44,
    paddingHorizontal: 12,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});

// ------ AuroraField ------
export const styles_AuroraField = StyleSheet.create({
  blob: {
    position: 'absolute',
    width: 320,
    height: 160,
    borderRadius: 160,
  },
  blobA: {top: 70, left: -70, backgroundColor: COLORS.aurora},
  blobB: {top: 170, right: -90, backgroundColor: COLORS.accent},
  blobC: {top: 300, left: -40, backgroundColor: COLORS.aurora},
});

// ------ Chip ------
export const styles_Chip = StyleSheet.create({
  btn: {flexGrow: 1, flexShrink: 1, borderRadius: RADIUS.pill},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  texts: {alignItems: 'flex-start'},
  label: {fontSize: 12, lineHeight: 24, fontWeight: '700', letterSpacing: 0.8},
  sub: {
    fontSize: 9,
    lineHeight: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    color: COLORS.textMuted,
    marginTop: -4,
  },
});

// ------ EmptyState ------
export const styles_EmptyState = StyleSheet.create({
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

// ------ FishSprite ------
const FISH_W = 44;
const FISH_H = 30;
export const styles_FishSprite = StyleSheet.create({
  wrap: {position: 'absolute', width: FISH_W, alignItems: 'center'},
  img: {width: FISH_W, height: FISH_H},
  ring: {
    position: 'absolute',
    top: -5,
    left: -5,
    width: FISH_W + 10,
    height: FISH_H + 10,
    borderRadius: (FISH_H + 10) / 2,
    borderWidth: 2,
    borderColor: COLORS.danger,
  },
  tag: {
    fontSize: 11,
    lineHeight: 13,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

// ------ FloatScore ------
export const styles_FloatScore = StyleSheet.create({
  text: {
    position: 'absolute',
    width: 120,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
});

// ------ HookLine ------
export const styles_HookLine = StyleSheet.create({
  svg: {position: 'absolute', top: 0, left: 0},
});

// ------ LevelTile ------
export const styles_LevelTile = StyleSheet.create({
  tile: {borderRadius: RADIUS.md},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  open: {
    backgroundColor: COLORS.glassLightSoft,
    borderColor: COLORS.border,
    ...SHADOW.card,
  },
  locked: {backgroundColor: COLORS.surface, borderColor: COLORS.surfaceAlt},
  selected: {borderColor: COLORS.accent, borderWidth: 2},
  number: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.accentDeep,
    fontVariant: ['tabular-nums'],
  },
});

// ------ LineGauge ------
export const styles_LineGauge = StyleSheet.create({
  wrap: {alignItems: 'flex-end'},
  label: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  row: {flexDirection: 'row', gap: 4, marginTop: 3},
  bar: {width: 14, height: 5, borderRadius: 3},
  intact: {backgroundColor: COLORS.aurora},
  lost: {backgroundColor: COLORS.danger, opacity: 0.35},
});

// ------ PauseOverlay ------
export const styles_PauseOverlay = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(11,42,67,0.86)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    borderRadius: RADIUS.xxl,
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 22,
    ...SHADOW.win,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: COLORS.textOnDark,
    textAlign: 'center',
  },
  line: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.3,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 4,
  },
  statsRow: {flexDirection: 'row', gap: 12, marginVertical: 16},
  stat: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  statValue: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.aurora,
    fontVariant: ['tabular-nums'],
  },
  statLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textOnDarkDim,
  },
  gap: {height: 10},
});

// ------ PrimaryButton ------
export const styles_PrimaryButton = StyleSheet.create({
  btn: {
    width: '100%',
    borderRadius: RADIUS.lg,
    ...SHADOW.primary,
  },
  disabled: {opacity: 0.45},
  fill: {width: '100%', height: '100%'},
  plate: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plateImage: {borderRadius: RADIUS.lg, opacity: 0.9},
  grad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.88,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontSize: 19,
    lineHeight: 24,
    fontWeight: '800',
    letterSpacing: 1,
    color: '#FFFFFF',
  },
});

// ------ QuotaChip ------
export const styles_QuotaChip = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    height: 28,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  chipDone: {
    backgroundColor: 'rgba(47,191,145,0.28)',
    borderColor: COLORS.success,
  },
  sprite: {width: 20, height: 20},
  text: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '700',
    color: COLORS.textOnDark,
    fontVariant: ['tabular-nums'],
  },
  textDone: {color: COLORS.success},
});

// ------ RoundIconButton ------
export const styles_RoundIconButton = StyleSheet.create({
  btn: {width: 44, height: 44},
  inner: {width: 44, height: 44},
  plate: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    overflow: 'hidden',
  },
  glyph: {width: 24, height: 24},
});

// ------ ScreenShell ------
export const styles_ScreenShell = StyleSheet.create({
  root: {flex: 1, backgroundColor: COLORS.abyss},
  bg: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0},
  content: {flex: 1},
});

// ------ SecondaryButton ------
export const styles_SecondaryButton = StyleSheet.create({
  btn: {width: '100%', borderRadius: RADIUS.md},
  fill: {
    width: '100%',
    height: '100%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {fontSize: 13, lineHeight: 24, fontWeight: '700', letterSpacing: 0.8},
});

// ------ SpeciesCard ------
export const styles_SpeciesCard = StyleSheet.create({
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

// ------ StarStrip ------
export const styles_StarStrip = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center', gap: 3},
});

// ------ StatCard ------
export const styles_StatCard = StyleSheet.create({
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

// ------ TrackRow ------
export const styles_TrackRow = StyleSheet.create({
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

// ------ WaterColumn ------
export const styles_WaterColumn = StyleSheet.create({
  column: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.hairlineDark,
    alignSelf: 'center',
    backgroundColor: COLORS.abyss,
  },
  bubble: {position: 'absolute', top: 0, backgroundColor: '#FFFFFF'},
  auroraClip: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 180,
    overflow: 'hidden',
  },
  ice: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: ICE_CEILING_H,
    backgroundColor: 'rgba(242,251,255,0.9)',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  hole: {
    width: HOLE_W,
    height: 22,
    borderRadius: 16,
    backgroundColor: COLORS.abyss,
    marginBottom: -6,
  },
  hintStrip: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(11,42,67,0.45)',
  },
  hintText: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 0.8,
    textAlign: 'center',
    color: COLORS.textOnDark,
  },
  flash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: RADIUS.xl,
    borderWidth: 3,
    borderColor: COLORS.danger,
  },
});

// ------ WindowBanner ------
export const styles_WindowBanner = StyleSheet.create({
  banner: {
    height: 34,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 14,
    marginLeft: 16,
    marginTop: 8,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(11,42,67,0.55)',
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
  },
  surge: {
    backgroundColor: 'rgba(123,228,214,0.3)',
    borderColor: COLORS.aurora,
  },
  text: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textOnDark,
  },
});

/* autopad-begin */
function ajiqow(): void {}
function yomuyene(): void {
  const defilef = 37;
  if (defilef > 91) return;
}
function oyiyidit(): string {
  const agayat: string = "xava";
  return agayat;
}
function asoroyodoy(_ategucigeyam: number, _upefinosefe: boolean): boolean {
  const ugudayum = 92;
  return ugudayum > 45 ? true : false;
}
function xugewebutila(_ukonoqo: boolean, _bonoku: boolean, _emexumiqe: number): number {
  const ilifobaz: number = 1;
  return ilifobaz;
}
function okotuve(): void {}
function apatete(): boolean {
  const ufoneroyi = 46;
  const izerosisiwaj: boolean = false;
  return izerosisiwaj;
}
function unozijo(_guyokose: string, _odivulux: number): void {
  const iwajawijekuq: boolean = true;
}
function kowomecaf(_qaqeru: number, _vuwamu: string): string {
  return "dalimad";
}
function rajilay(_asipofe: boolean, _awonoz: number): boolean {
  return false;
}
function ajagitageq(_ewokug: boolean, _duzatali: number, _ayesurojef: string): number {
  const odekite: number = 58;
  return odekite;
}
function boyixa(_upafafolo: boolean, _tutovib: boolean, _cuxuxazepufu: number): string {
  const eyulosa = 48;
  return eyulosa > 9 ? "agup" : "umub";
}
function omopeyijow(_akocoleyat: string): string {
  return "eyodu";
}
function ikisapufa(_gulajeli: string): boolean {
  const awicag = 33;
  return awicag > 21 ? true : false;
}
function socefona(_iloqixebil: number, _apukitinewa: number, _ujoraxi: boolean): void {}
function vugucuyede(): number {
  return 174;
}
function xilinox(): number {
  const uzerokece = 77;
  const wiqeguqamak: number = 31;
  return wiqeguqamak;
}
function unajizoquyuk(_pomutoqer: boolean, _binoqekinuku: string, _wiseku: number): number { return 191; }
/* autopad-end */
