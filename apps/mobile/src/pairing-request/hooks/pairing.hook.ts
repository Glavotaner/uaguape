import { useCallback, useEffect, useState } from "react";
import { ToastAndroid } from "react-native";
import { usePairs } from "../../shared/hooks/pairs";
import { PairRoutes } from "@uaguape/routes";

export const usePairing = (pairId: string) => {
  const [pairName, setPairName] = useState<string | null>(null);
  const pairs = usePairs();

  useEffect(() => {
    const fetchPairName = async () => {
      const pair = await pairs.get(PairRoutes.ID.replace(":pairId", pairId));
      if (pair) {
        setPairName(pair.name);
      }
    };
    if (pairId) {
      fetchPairName();
    }
  }, [pairId]);

  const confirmPair = useCallback(async () => {
    await pairs.setPair(pairId!);
    ToastAndroid.show("Paired successfully", ToastAndroid.SHORT);
  }, [pairId]);

  return { pairName, confirmPair };
};
