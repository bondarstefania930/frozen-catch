import {Profile, defaultProfile, hydrate} from './profile';

const KEY = 'frozencatch.profile.v1';

/**
 * Local persistence with an in-memory fallback. The native backend is loaded
 * defensively: if it is not installed the app still boots and plays, it simply
 * stops remembering between launches. No screen touches storage directly.
 */
let backend: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  backend = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  backend = null;
}

const memory = new Map<string, string>();

export async function loadProfile(): Promise<Profile> {
  try {
    const raw = backend
      ? await backend.getItem(KEY)
      : memory.get(KEY) || null;
    if (!raw) {
      return defaultProfile();
    }
    return hydrate(JSON.parse(raw));
  } catch (e) {
    return defaultProfile();
  }
}

export async function saveProfile(profile: Profile): Promise<void> {
  try {
    const raw = JSON.stringify(profile);
    memory.set(KEY, raw);
    if (backend) {
      await backend.setItem(KEY, raw);
    }
  } catch (e) {
    // persistence is best-effort; a failed write never breaks a round
  }
}

export async function clearProfile(): Promise<void> {
  try {
    memory.delete(KEY);
    if (backend) {
      await backend.removeItem(KEY);
    }
  } catch (e) {
    // ignore
  }
}

export function hasNativeBackend(): boolean {
  return backend !== null;
}
