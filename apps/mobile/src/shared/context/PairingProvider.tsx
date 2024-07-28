import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Linking, ToastAndroid } from "react-native";
import { usePairs } from "../hooks/pairs";

const PairingContext = createContext<{
  pairId: string | null;
  hasPair: boolean;
  confirmPair: () => void;
  cancelPair: () => void;
}>({
  pairId: null,
  hasPair: false,
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
  const pairs = usePairs();

  const parsePairId = (url: string) => url.split("uaguape://pair/").pop()!;

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
    await pairs.setPair(pairId!);
    setPairId(null);
    ToastAndroid.show("Paired successfully", ToastAndroid.SHORT);
  }, [pairId]);

  return (
    <PairingContext.Provider
      value={{
        pairId,
        hasPair: pairId != null,
        confirmPair,
        cancelPair: () => setPairId(null),
      }}
    >
      {children}
    </PairingContext.Provider>
  );
};
