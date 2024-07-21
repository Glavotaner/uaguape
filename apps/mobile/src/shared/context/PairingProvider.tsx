import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Linking, ToastAndroid } from "react-native";
import { useApi } from "./ApiProvider";
import { PairRoutes, UserRoutes } from "uaguape-routes";

const PairingContext = createContext<{
  pairId: string | null;
  hasPairId: boolean;
  confirmPair: () => void;
  cancelPair: () => void;
}>({
  pairId: null,
  hasPairId: false,
  confirmPair: () => {},
  cancelPair: () => {},
});

export const usePairing = () => useContext(PairingContext);

export const PairingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [pairId, setPairId] = useState<string | null>(null);
  const { pairs } = useApi();

  const parsePairId = (url: string) => url.split("uaguape:/pair/").pop()!;

  useEffect(() => {
    const checkInitialDeeplink = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setPairId(parsePairId(initialUrl));
      }
    };
    checkInitialDeeplink();
    const subscriber = Linking.addEventListener("url", ({ url }) => {
      if (url) {
        setPairId(parsePairId(url));
      }
    });
    return subscriber.remove;
  }, []);

  const confirmPair = useCallback(async () => {
    await pairs.patch(PairRoutes.ID.replace(":pairId", pairId!));
    setPairId(null);
    ToastAndroid.show("Paired successfully", ToastAndroid.SHORT);
  }, [pairId]);

  return (
    <PairingContext.Provider
      value={{
        pairId,
        hasPairId: pairId != null,
        confirmPair,
        cancelPair: () => setPairId(null),
      }}
    >
      {children}
    </PairingContext.Provider>
  );
};
