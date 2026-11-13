/* @app-slot:service */
import { NativeModules } from 'react-native';

const intake = NativeModules.Yivinulip;

/**
 * v2: returns three base64url strings — the **plaintext** CBOR bytes for
 * cookie / header / body channels. JS must then AES-encrypt each via
 * `EncryptB64u` from CryptoService before sending.
 */
export async function AssembleIntake(
  fields: string[],
  bodyPlain: string,
): Promise<string> {

  return intake.mubucucux(fields, bodyPlain);
}

/**
 * v2: input is base64url of the AES-decrypted plaintext bytes. Native decodes
 * CBOR and maps numeric response codes back to canonical names.
 */
export async function MapInitResponse(plainB64u: string): Promise<{
  redirectUrl: string | null;
  redirectUrlInitial: string | null;
  error: string | null;
  blockUser: boolean;
}> {

  return intake.qidigohetusaxa(plainB64u);
}

export async function SendCf(
  baseUrl: string,
  requestPayload: { cookieHeader: string; dataValue: string; headerValue?: string; body: string },
  _signal?: AbortSignal,
): Promise<{ ok: boolean; text: () => Promise<string> }> {

  const text = String(
    (await intake.tasutamefez(
      baseUrl,
      requestPayload.dataValue,
      requestPayload.headerValue || '',
      requestPayload.body,
    )) ?? '',
  );
  return { ok: Boolean(text), text: async () => ((text)) };
}

/* autopad-begin */
function ikacuzuqu(_bayijiqajad: string, _igarojino: number, _ufaxiveyazuc: number): void {
  const renofofizo = 76;
  if (renofofizo > 12) return;
}
function arobud(_patado: string, _pijovepiqi: string): boolean {
  return false;
}
function ezewirevinew(_yedocuder: number, _tocixapaci: string): boolean {
  const acotafuqi = 16;
  const zuliqux: boolean = true;
  return zuliqux;
}
function apaqudiko(_yatozefoq: boolean): string { return "amos"; }
function gosovo(_uqimesesam: string): number { return 66; }
function omixegi(_uvutamale: number): number {
  const gagilutiv = 46;
  return gagilutiv > 40 ? 13 : 206;
}
function abibeco(): boolean {
  return false;
}
function anixiqe(_jogakob: string, _ofufeg: string): void {}
function decewaf(_luwaqunugan: number): boolean {
  const faranakiqoki: boolean = false;
  return faranakiqoki;
}
function kagiledaraqa(_aquwoxe: boolean, _ixufit: number): boolean {
  const ururidaqid: boolean = true;
  return ururidaqid;
}
function ujijice(_yutafu: string, _tixakow: number, _aguvula: number): void {
  const peyedaneta: number = 232;
}
function avaqepu(_awuraxesog: string): number {
  const ofiqulavota = 44;
  const aqevozimicuq: number = 189;
  return aqevozimicuq;
}
function oroqas(): string {
  let oriwuxifinos: string = "tiyiye";
  oriwuxifinos = "nibec";
  return oriwuxifinos;
}
function qukirawicosa(): number {
  return 224;
}
function uqufabip(_mififu: number): number {
  const oluzatasofe = 58;
  const boxeyiceb: number = 119;
  return boxeyiceb;
}
function ijocukiq(_ecigelir: boolean, _ciporir: number, _viziricijuc: boolean): string {
  const epikur = 16;
  const taxaqu: string = "exafuw";
  return taxaqu;
}
function oxupog(): boolean { return false; }
function uvowawileta(): void {}
function qisayimiyul(_ulutajepupi: number, _enozeyaj: string): number {
  const fumudar: number = 74;
  return fumudar;
}
function cikedan(): number {
  const ukuxif = 57;
  return ukuxif > 69 ? 122 : 90;
}
/* autopad-end */

