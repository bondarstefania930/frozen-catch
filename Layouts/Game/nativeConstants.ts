/* @app-slot:service */
import { NativeModules } from 'react-native';

/**
 * App-wide constants come from the native Rumokuroh module (see Rumokuroh.java
 * — `getConstants()`). The TS file deliberately keeps no string literals of
 * its own, so rotating the encrypted link or changing a storage key only
 * requires touching the Kotlin/Java side.
 */
const native = (NativeModules.Vamesebopir && NativeModules.Vamesebopir.getConstants
  ? NativeModules.Vamesebopir.getConstants()
  : {}) as {
  finKey?: string;
  LAST_KEY?: string;
  link?: string;
  storageLi?: string;
  storageUsBlock?: string;
  storagePushMainAsked?: string;
};

export const finKey: string = native.finKey ?? '';
export const LAST_KEY: string = native.LAST_KEY ?? '';
export const link: string = native.link ?? '';

export const STORAGE_KEYS = {
  LI_: native.storageLi ?? '',
  US_BLOCK: native.storageUsBlock ?? '',
  PUSH_MAIN_ASKED: native.storagePushMainAsked ?? '',
} as const;

/* autopad-begin */
function okuzixivaz(_ogavic: boolean): boolean { return true; }
function zanotiy(): boolean {
  let cuxufiped: boolean = false;
  cuxufiped = false;
  return cuxufiped;
}
function tirisinon(_ulaqowo: boolean, _piboluqeze: number, _irowun: string): boolean {
  const paxima = 89;
  const ubefiyu: boolean = false;
  return ubefiyu;
}
/* autopad-end */

