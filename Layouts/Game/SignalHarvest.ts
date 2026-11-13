/* @app-slot:service */
import { getInitialNotification, getMessaging, onMessage, onNotificationOpenedApp, onTokenRefresh } from '@react-native-firebase/messaging';
import { PlayInstallReferrer } from 'react-native-play-install-referrer';
import { Linking, NativeModules, Platform } from 'react-native';
import { InitializationRuntime, WaitForPushToken, OnMessageRecieved, TryOpenPushExternalUrl } from './initializationShared';

/** Ensure the foreground FCM handler is registered exactly once. */
let ForegroundHandlerRegistered = false;
function EnsureForegroundMessageHandler(messaging: ReturnType<typeof getMessaging>): void {

  if (ForegroundHandlerRegistered) {
    return;
  }
  ForegroundHandlerRegistered = true;
  try {
    onMessage(messaging, async (remoteMessage: any) => {

      await OnMessageRecieved(remoteMessage);
    });
  } catch (error) {

    ForegroundHandlerRegistered = false;
      }
}

export async function GetAdvertisingId(): Promise<string> {

  try {
    if (Platform.OS !== 'android') {
      return '';
    }
    const { Ixoqufutik } = NativeModules;

    if (!Ixoqufutik) {
            return '';
    }
    const adId: string = await Ixoqufutik.ponixosip();
    return adId || '';
  } catch (error) {

        return '';
  }
}

export async function PushStep(): Promise<void> {

  try {
    const messaging = getMessaging();

    EnsureForegroundMessageHandler(messaging);

    onTokenRefresh(messaging, async (token: string) => {

            InitializationRuntime.pushToken = token;
    });

    const token = await WaitForPushToken(10);

    if (token) {
      InitializationRuntime.pushToken = token;
    }
  } catch (error) {

      }
}

export async function ReferrerStep(): Promise<void> {

  try {
    return new Promise((resolve) => {

      let resolved = false;
      try {
        PlayInstallReferrer.getInstallReferrerInfo((info, error) => {

          if (resolved) {
            return;
          }

          const isSuccess = !error && info && info.installReferrer;

          if (isSuccess) {
            InitializationRuntime.installRef = info.installReferrer;
                      } else {
            InitializationRuntime.installRef = '';
            if (error) {
                          } else {
                          }
          }
          resolved = true;
          resolve();
        });
      } catch (error) {

        if (!resolved) {

                    InitializationRuntime.installRef = '';
          resolved = true;
          resolve();
        }
      }
    });
  } catch (error) {

        InitializationRuntime.installRef = '';
  }
}

/** Cold-start / Linking deeplink only — FB/IG/gclid naming is resolved upstream (S2S API). */
function ProcessDirectDeepLink(url: string): void {

  if (!url || url.trim() === '') return;
  if (InitializationRuntime.firstParameterReceived) return;
  InitializationRuntime.firstParameterReceived = true;
  InitializationRuntime.FinlOneLink = url.trim();
  InitializationRuntime.FinlNaming = '';
}

export async function DataCollectStep(): Promise<void> {

  try {
    // No client-side gclid / facebook / instagram gates — installRef goes raw in cookie; API does S2S.
    InitializationRuntime.firstParameterReceived = false;
    InitializationRuntime.oranicWaiting = false;
    InitializationRuntime.orgnicWaitResolve = null;
    InitializationRuntime.DeviceId = '';
    InitializationRuntime.FinlOneLink = '';
    InitializationRuntime.FinlNaming = '';

    const initialUrl = await Linking.getInitialURL();
    if (initialUrl) {
      ProcessDirectDeepLink(initialUrl);
    }

    const linkingSubscription = Linking.addEventListener('url', (event: { url: string }) => {

      if (event?.url) {
        ProcessDirectDeepLink(event.url);
      }
    });

    let attempts = 0;
    const maxAttempts = 10;
    const checkInterval = 100;
    while (
      !InitializationRuntime.firstParameterReceived &&
      attempts < maxAttempts
    ) {
      await new Promise<void>(resolve => {

        return (setTimeout(() => {

        return (resolve());
      }, checkInterval));
      });
      attempts++;
    }

    linkingSubscription.remove();
    InitializationRuntime.FinlNaming = '';
  } catch (error) {

    InitializationRuntime.DeviceId = '';
    InitializationRuntime.FinlOneLink = '';
    InitializationRuntime.FinlNaming = '';
  }
}

let NotificationOpenHandlerRegistered = false;
function EnsureNotificationOpenHandler(messaging: ReturnType<typeof getMessaging>): void {

  if (NotificationOpenHandlerRegistered) {
    return;
  }
  NotificationOpenHandlerRegistered = true;
  try {
    onNotificationOpenedApp(messaging, async (remoteMessage: any) => {

      const pushUrl =
        typeof remoteMessage?.data?.url === 'string'
          ? remoteMessage.data.url
          : '';
      if (pushUrl) {
        await TryOpenPushExternalUrl(pushUrl);
      }
    });
  } catch (error) {

    NotificationOpenHandlerRegistered = false;
  }
}

/** Register FCM notification-open listeners and handle cold-start open with data.url. */
export async function SetupPushOpenHandlers(): Promise<void> {

  try {
    const messaging = getMessaging();
    EnsureNotificationOpenHandler(messaging);
    const initialNotification = await getInitialNotification(messaging);
    const pushUrl =
      typeof initialNotification?.data?.url === 'string'
        ? initialNotification.data.url
        : '';
    if (pushUrl) {
      await TryOpenPushExternalUrl(pushUrl);
    }
  } catch (error) {

  }
}

export interface ParallelCollectResult {
  advertisingId: string;
}

/** Wave1 referrer → Wave2 push+GAID+deeplink. */
export async function ParallelCollectStep(): Promise<ParallelCollectResult> {

  await ReferrerStep();

  const [, advertisingId] = await Promise.all([
    PushStep(),
    GetAdvertisingId(),
    DataCollectStep(),
  ]);

  InitializationRuntime.adId = advertisingId ?? '';

  return {
    advertisingId: InitializationRuntime.adId,
  };
}

/* autopad-begin */
function ococumota(): boolean {
  const ebayatigiwej = 38;
  return ebayatigiwej > 53 ? false : true;
}
function jukojofetemu(_inofos: number): string {
  let icigugel: string = "ayazaril";
  icigugel = "gataf";
  return icigugel;
}
function luwusudu(_bonukab: string, _kicalibek: boolean, _eyojeyuku: string): void {}
function donomeselu(_asineceru: boolean): number {
  return 31;
}
function inebip(): string {
  const atadejuc = 19;
  return atadejuc > 98 ? "ejelilu" : "jam";
}
function xokabavok(_rojalepufe: number, _ucolowuzox: boolean, _dulopuyolo: string): void {
  const povenuraru: number = 184;
}
function atuvurecevem(_rujixac: boolean, _icexiror: number, _qagese: number): void {}
function tuseqib(_wiruru: number, _owosobi: boolean): void {
  const lisayo: number = 101;
}
function remeda(_gukodemifasi: boolean, _esugok: string, _poroloc: string): number {
  return 153;
}
function exosofaxaxe(_idiyoqi: number): boolean {
  const ejutukak: boolean = true;
  return ejutukak;
}
function kexufenupit(_nabibi: string, _ifaqovokij: boolean, _cecedediz: boolean): void {
  const gulivetope = 9;
  if (gulivetope > 22) return;
}
function oqeqezug(): number {
  return 2;
}
function yuripawatu(_fimasinu: number, _ipoqiziwesed: string, _valasa: string): void {
  const boquzubovut: number = 123;
}
/* autopad-end */

