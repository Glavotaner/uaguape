import SecureStorage, { ACCESSIBLE } from "rn-secure-storage";

export enum StorageKeys {
  AUTH_STATE = "authState",
  USER = "user",
}

type StorageHook = <T>(
  key: StorageKeys
) => [
  getItem: () => Promise<T | null>,
  setItem: (item: T | null) => Promise<void>
];

export const useStorage: StorageHook = <T>(key: StorageKeys) => {
  const getItem = async () => {
    try {
      const item = await SecureStorage.getItem(key);
      return item ? (JSON.parse(item!) as T) : null;
    } catch {
      return null;
    }
  };
  const setItem = async (item: T | null) => {
    try {
      if (item == null) {
        await SecureStorage.removeItem(key);
      } else {
        await SecureStorage.setItem(key, JSON.stringify(item), {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        });
      }
    } catch {
      return Promise.resolve();
    }
  };
  return [getItem, setItem];
};
