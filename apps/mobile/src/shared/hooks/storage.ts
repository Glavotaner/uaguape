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
  const setItem = async (item: unknown) => {
    try {
      if (item == null) {
        return await SecureStorage.removeItem(key);
      } else {
        return await SecureStorage.setItem(key, JSON.stringify(item), {
          accessible: ACCESSIBLE.WHEN_UNLOCKED,
        });
      }
    } catch (error) {
      return Promise.resolve(null);
    }
  };
  return [getItem, setItem];
};
