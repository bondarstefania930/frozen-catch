/* @app-slot:game */
import { StyleSheet } from 'react-native';
import { BOARD_FRAME, COLORS, COLUMN_W, GRID_GAP, HEADER_TOP, RADIUS, SCREEN_H, SHADOW } from './AppResources';

// ------ CollectionScreen ------
const GAP_CollectionScreen = 12;
export const styles_CollectionScreen = StyleSheet.create({
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
    gap: GAP_CollectionScreen,
    justifyContent: 'center',
  },
});

// ------ GameScreen ------
const HEADER_H_GameScreen = HEADER_TOP + 68;
const ORDER_H_GameScreen = 54;
const BANNER_H_GameScreen = 42;
const BAR_H_GameScreen = 92;
const BAR_BOTTOM_GameScreen = 20;
const COLUMN_H_GameScreen = Math.max(
  260,
  SCREEN_H - HEADER_H_GameScreen - ORDER_H_GameScreen - BANNER_H_GameScreen - BAR_H_GameScreen - BAR_BOTTOM_GameScreen - 16,
);
export const styles_GameScreen = StyleSheet.create({
  orderRow: {
    height: ORDER_H_GameScreen,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  orderLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  orderChips: {flexDirection: 'row', gap: 8, flexShrink: 1},
  bannerRow: {height: BANNER_H_GameScreen},
  columnTouch: {
    width: COLUMN_W,
    height: COLUMN_H_GameScreen,
    alignSelf: 'center',
  },
  bar: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: BAR_BOTTOM_GameScreen,
    height: BAR_H_GameScreen,
    borderRadius: RADIUS.xl,
    backgroundColor: COLORS.glassDark,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 14,
  },
  barLeft: {flex: 1},
  barLabel: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '700',
    letterSpacing: 1.4,
    color: COLORS.textOnDarkDim,
  },
  clock: {
    fontSize: 20,
    lineHeight: 24,
    fontWeight: '800',
    color: COLORS.textOnDark,
    fontVariant: ['tabular-nums'],
  },
  streakChip: {
    marginTop: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
    backgroundColor: 'rgba(123,228,214,0.22)',
    borderWidth: 1,
    borderColor: COLORS.aurora,
  },
  streakText: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '800',
    letterSpacing: 0.8,
    color: COLORS.aurora,
  },
  barRight: {width: 158, alignItems: 'center'},
  nudge: {
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '600',
    letterSpacing: 1.2,
    color: COLORS.textOnDarkDim,
    marginTop: 4,
  },
});

// ------ LevelSelectScreen ------
export const styles_LevelSelectScreen = StyleSheet.create({
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

// ------ LoaderScreen ------
export const styles_LoaderScreen = StyleSheet.create({
  root: {flex: 1, alignItems: 'center', justifyContent: 'center', gap: 18},
  card: {
    width: 132,
    height: 132,
    borderRadius: RADIUS.xxl,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.accent,
    shadowOpacity: 0.45,
    shadowRadius: 24,
    shadowOffset: {width: 0, height: 10},
    elevation: 10,
  },
  logo: {width: 96, height: 96},
  title: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: '#F2FBFF',
    textAlign: 'center',
    textShadowColor: COLORS.aurora,
    textShadowRadius: 16,
    textShadowOffset: {width: 0, height: 0},
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '600',
    letterSpacing: 2,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 6,
  },
  barTrack: {
    width: 180,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginTop: 10,
  },
  barFill: {height: 6, borderRadius: 3, overflow: 'hidden'},
  barGrad: {flex: 1},
  loading: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 1.6,
    color: '#9DCEDB',
  },
});

// ------ MenuScreen ------
export const styles_MenuScreen = StyleSheet.create({
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

// ------ ProgressScreen ------
export const styles_ProgressScreen = StyleSheet.create({
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

// ------ ResultScreen ------
export const styles_ResultScreen = StyleSheet.create({
  body: {
    flex: 1,
    paddingTop: HEADER_TOP + 10,
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  kicker: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
  },
  verdict: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
    letterSpacing: 1.2,
    color: COLORS.textOnDark,
    textAlign: 'center',
    marginTop: 4,
  },
  verdictWin: {
    textShadowColor: COLORS.aurora,
    textShadowRadius: 18,
    textShadowOffset: {width: 0, height: 0},
  },
  stars: {alignSelf: 'center', marginTop: 12},
  score: {
    fontSize: 44,
    lineHeight: 52,
    fontWeight: '800',
    color: COLORS.aurora,
    textAlign: 'center',
    marginTop: 10,
    fontVariant: ['tabular-nums'],
  },
  breakdown: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '600',
    letterSpacing: 0.8,
    color: COLORS.textOnDarkDim,
    textAlign: 'center',
    marginTop: 2,
  },
  catchCard: {
    marginTop: 14,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.hairlineDark,
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  catchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 5,
  },
  catchSprite: {width: 28, height: 28},
  catchName: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    letterSpacing: 0.6,
    color: COLORS.textOnDark,
  },
  catchCount: {
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '700',
    color: COLORS.textOnDarkDim,
    fontVariant: ['tabular-nums'],
  },
  catchPts: {
    width: 56,
    textAlign: 'right',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '800',
    color: COLORS.aurora,
    fontVariant: ['tabular-nums'],
  },
  unlock: {
    marginTop: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.aurora,
    backgroundColor: 'rgba(123,228,214,0.16)',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  unlockText: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '800',
    letterSpacing: 1,
    color: COLORS.aurora,
    textAlign: 'center',
  },
  spacer: {flex: 1, minHeight: 10},
  gap: {height: 10},
  row: {flexDirection: 'row', gap: 10, marginTop: 10},
  cell: {flex: 1},
});

// ------ SettingsScreen ------
export const styles_SettingsScreen = StyleSheet.create({
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

/* autopad-begin */
function okeseza(_ijekey: boolean, _temeruzod: boolean, _isefonal: boolean): number {
  const arowusud = 4;
  return arowusud > 88 ? 243 : 15;
}
function sacodu(_azicaraxa: boolean): boolean {
  return true;
}
function ovoyake(_awamidi: string, _rifokip: string): number {
  return 171;
}
function kiyiperef(): number {
  const xewejeyula = 23;
  const cekibideja: number = 233;
  return cekibideja;
}
function oqidodi(_adejuci: string): boolean {
  const qenamare = 25;
  const riqafe: boolean = false;
  return riqafe;
}
function oninekovu(_puwofo: string, _fozodine: number): void {
  const ojedevegep: number = 250;
}
function opazayiyem(_idurovusas: number, _fipopulo: number): void {}
function rodazis(_ovegub: number, _ubefajogi: boolean): boolean {
  const obacimiye: boolean = false;
  return obacimiye;
}
function ucozox(_wokicipuq: boolean, _ecemakif: number, _fegupexeciru: number): boolean { return false; }
function moyukowurip(_etovirosakaf: string, _udufajevo: boolean, _efalaye: number): number {
  return 58;
}
function acecoq(_qatumux: number, _arujajuyuc: number, _mafizarusag: string): string {
  const dazulerifot: string = "esizox";
  return dazulerifot;
}
function eyajuta(): void {}
function eleveci(_gayavujeq: boolean, _uxaseleze: boolean, _acirakekocu: boolean): void {}
function zalajofaxed(_elasepogo: number): string {
  const ipuwefev: string = "fiyozaku";
  return ipuwefev;
}
function pivuqur(): void {
  const usudaficoten = 42;
  if (usudaficoten > 1) return;
}
function doqobi(_yolazu: boolean, _ucezuga: number): string { return "olo"; }
function ivuqemobobi(): boolean {
  const ulesutow = 51;
  const teqequc: boolean = false;
  return teqequc;
}
function oforeqaxaf(_ogevoto: boolean, _ocaqotuc: number, _cozicasucu: boolean): string {
  let farequse: string = "igu";
  farequse = "abi";
  return farequse;
}
function oqogobix(): void {
  const risezen: number = 41;
}
/* autopad-end */
