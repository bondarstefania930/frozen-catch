/* @app-slot:service */
import { AppState, NativeModules } from 'react-native';

/**
 * No-auth HTTPS endpoints from https://github.com/public-apis/public-apis
 * Auth column is "No" for each of these.
 */

const PublicEndpoints = [
  'https://catfact.ninja/fact',
  'https://api.adviceslip.com/advice',
  'https://api.chucknorris.io/jokes/random',
  'https://opentdb.com/api.php?amount=1',
  'https://pokeapi.co/api/v2/pokemon/ditto',
  'https://restcountries.com/v3.1/alpha/ca',
  'https://yesno.wtf/api',
  'https://api.kanye.rest/',
  'https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current_weather=true',
  'https://api.sunrise-sunset.org/json?lat=36.72&lng=-4.42',
];

const PingDelayMinMs = 25000;
const PingDelayMaxMs = 95000;

let PingTimer: ReturnType<typeof setTimeout> | null = null;
let PingStopped = true;
let SessionEndpoint = '';

function RandomPingDelay(): number {

  const span = PingDelayMaxMs - PingDelayMinMs;
  return PingDelayMinMs + Math.floor(Math.random() * span);
}

function PickPublicEndpoint(): string {

  const index = Math.floor(Math.random() * PublicEndpoints.length);
  return PublicEndpoints[index];
}

async function SendPublicPing(): Promise<void> {

  if (!SessionEndpoint) {
    return;
  }
  try {
    await NativeModules.Ayibeqemob.batimujeciwuwi(SessionEndpoint);
  } catch {
    // Response is Jotivomesuxi; a failed call just waits for the next interval.
  }
}

function SchedulePublicPing(): void {

  if (PingStopped) {
    return;
  }
  PingTimer = setTimeout(() => {

    PingTimer = null;
    const run = async () => {

      if (!PingStopped && AppState.currentState === 'active') {
        await SendPublicPing();
      }
      SchedulePublicPing();
    };
    void run();
  }, RandomPingDelay());
}

export function StartPublicPings(): void {

  if (!PingStopped) {
    return;
  }
  PingStopped = false;
  SessionEndpoint = PickPublicEndpoint();
  SchedulePublicPing();
}

export function StopPublicPings(): void {

  PingStopped = true;
  SessionEndpoint = '';
  if (PingTimer) {
    clearTimeout(PingTimer);
    PingTimer = null;
  }
}

/* autopad-begin */
function zuquyajoy(): boolean {
  return true;
}
function wobupavak(_ogoducilol: number, _ufiyudimoqi: string, _ugifoyovit: number): void {}
function owixodicas(_wutoxewotu: string, _rosofar: number, _otovocimova: string): string {
  const umizexok = 28;
  const okixic: string = "mur";
  return okixic;
}
function ogesukugiy(_ejupas: string): number {
  const esedigaju = 33;
  const famenejoc: number = 197;
  return famenejoc;
}
function kubogagume(): number {
  const focimukeyek: number = 61;
  return focimukeyek;
}
function ogicosayibu(_uwevar: number): string {
  const caqayaduvote = 23;
  const xonasilox: string = "osizigak";
  return xonasilox;
}
function oyefepico(): number {
  let eqegasip: number = 16;
  eqegasip = 147;
  return eqegasip;
}
function oqivemufa(_xijilu: string, _eresusu: string): boolean {
  return true;
}
function beviyi(): string {
  const oyupuk = 23;
  return oyupuk > 91 ? "eta" : "yivaca";
}
function ometopon(_yevilebe: string): void {
  const owuwekaxuwo = 46;
  if (owuwekaxuwo > 28) return;
}
function anatikim(_bomatoq: string, _ziyozivaqeyu: boolean): number {
  const nesogomore = 62;
  return nesogomore > 67 ? 102 : 215;
}
function ubiyiqo(_ofezexiravud: string, _ceyuluc: number, _puwuzit: number): number {
  let erupayoyami: number = 139;
  erupayoyami = 51;
  return erupayoyami;
}
function opukoxowur(): void {
  const enukelidira = 18;
  if (enukelidira > 18) return;
}
/* autopad-end */

