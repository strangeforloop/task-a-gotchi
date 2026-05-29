import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Persist a JSON-serializable store to AsyncStorage.
 *
 * Failures are logged rather than swallowed, so a write that fails (storage
 * full, permissions, etc.) is visible in dev instead of silently losing data.
 * Writes stay fire-and-forget so the UI never blocks on disk I/O.
 */
export function writeStore(key: string, value: unknown): void {
  AsyncStorage.setItem(key, JSON.stringify(value)).catch(err => {
    console.warn(`[storage] failed to persist "${key}":`, err);
  });
}
