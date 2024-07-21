import SecureStorage, { ACCESSIBLE } from "rn-secure-storage";

export enum StorageKeys {
  AUTH_STATE = "authState",
  USER = "user",
}

type StorageHook<T = any> = (
  key: StorageKeys
) => [getItem: () => Promise<T | null>, setItem: (item: T) => Promise<T>];

export const useStorage: StorageHook = (key: StorageKeys) => {
  const getItem = async () => {
    try {
      const item = await SecureStorage.getItem(key);
      return item ? JSON.parse(item!) : null;
    } catch {
      return null;
    }
  };
  const setItem = (item: unknown) => {
    if (item == null) {
      return SecureStorage.removeItem(key);
    } else {
      return SecureStorage.setItem(key, JSON.stringify(item), {
        accessible: ACCESSIBLE.WHEN_UNLOCKED,
      });
    }
  };
  return [getItem, setItem];
};
