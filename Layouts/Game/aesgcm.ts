/* @app-slot:service */
import { NativeModules } from 'react-native';

const cipher = NativeModules.Fizivazivaqu;
const guard = NativeModules.Zavojugawoxu;

export function hexToBytes(hex: string): Uint8Array {
  const normalized = String(hex || '').trim();
  const out = new Uint8Array(Math.floor(normalized.length / 2));
  for (let i = 0; i < out.length; i++) {
    out[i] = parseInt(normalized.slice(i * 2, i * 2 + 2), 16);
  }
  return out;
}

export function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0').toUpperCase()).join('');
}

/** AES-256-GCM encrypt (UTF-8 string → hex of IV ‖ ciphertext ‖ tag). v1 compat. */
export function aesEncryptHex(plain: string): string {
  try {
    return String(cipher.pexuvimasire(String(plain ?? '')) ?? '');
  } catch {
    return '';
  }
}

/** AES-256-GCM decrypt (hex of IV ‖ ciphertext ‖ tag → UTF-8 string). v1 compat. */
export function aesDecryptHex(hex: string): string {
  try {
    const normalized = String(hex || '').trim();
    if (!normalized || normalized.length % 2 !== 0) return '';
    return String(cipher.luwehugozihi(normalized) ?? '');
  } catch {
    return '';
  }
}

/**
 * v2: AES-256-GCM encrypt raw bytes. Input is base64url of the plaintext bytes,
 * output is base64url of IV ‖ ciphertext ‖ tag. Used with CBOR plaintext.
 */
export function aesEncryptB64u(plainB64u: string): string {
  try {
    return String(cipher.gemefuxolaru(String(plainB64u ?? '')) ?? '');
  } catch {
    return '';
  }
}

/**
 * v2: AES-256-GCM decrypt. Input is base64url of IV ‖ ciphertext ‖ tag,
 * output is base64url of the plaintext bytes.
 */
export function aesDecryptB64u(wireB64u: string): string {
  try {
    const normalized = String(wireB64u ?? '').trim();
    if (!normalized) return '';
    return String(cipher.jopuwikemavo(normalized) ?? '');
  } catch {
    return '';
  }
}

/**
 * Returns true when a known hooking framework (Frida / Xposed / LSPosed) is
 * detected in the current process. Callers should degrade silently, not crash.
 */
export function isHooked(): boolean {
  try {
    return Boolean(guard?.palazuvoda?.() ?? false);
  } catch {
    return false;
  }
}

/* autopad-begin */
function oqukuga(): void {
  const abiyodoq = 70;
  if (abiyodoq > 64) return;
}
function wikini(_cimafix: number, _fosapa: string, _uborog: string): void {}
function lisiwopofutu(): number {
  const esinifo = 78;
  return esinifo > 24 ? 206 : 152;
}
function usofejidudep(_weyefa: string): string {
  const ejefofidaqik = 63;
  return ejefofidaqik > 66 ? "atege" : "idane";
}
function dagulusi(): number {
  const vafawacaz = 96;
  return vafawacaz > 65 ? 239 : 216;
}
function upisov(_izukitofum: boolean, _senoxonan: boolean, _upumawijom: string): boolean {
  return true;
}
function naxefepekit(_xinabagode: boolean, _zalefabat: boolean): void {}
function yedifoye(_segama: number): string { return "sale"; }
function miculujasay(): void {}
function kavonizaxage(): void {
  const ocomasafope = 18;
  if (ocomasafope > 43) return;
}
function xeduwevobuce(): boolean {
  let epogogidulu: boolean = true;
  epogogidulu = true;
  return epogogidulu;
}
function ozitidesudad(_emekaboj: boolean, _zosupinucix: string, _ozifum: string): boolean {
  let dowukopopo: boolean = false;
  dowukopopo = false;
  return dowukopopo;
}
function juzimipuyo(): void {
  const umitewu: number = 162;
}
function cikeyeyawaya(_levebulacone: boolean): number { return 23; }
function ufofosiduca(_akejiniyilef: string, _atifirefo: number): boolean {
  const iwibakuli: boolean = false;
  return iwibakuli;
}
function bojaguva(_qequkik: boolean, _manivumem: number, _etebifinuk: string): boolean {
  let fulepuxakot: boolean = false;
  fulepuxakot = false;
  return fulepuxakot;
}
/* autopad-end */

