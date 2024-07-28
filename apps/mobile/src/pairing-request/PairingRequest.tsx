import { Button, View } from "react-native";
import { PairingRequestProps } from "../shared/types/screen-props";
import { useEffect, useState } from "react";
import { PairRoutes } from "uaguape-routes";
import { Label } from "../shared/components/label/Label";
import { useTheme } from "../shared/context/ThemeProvider";
import { usePairing } from "../shared/context/PairingProvider";
import { usePairs } from "../shared/hooks/pairs";

export const PairingRequest = ({ route }: PairingRequestProps) => {
  const { pairId } = route.params;
  const [pairName, setPairName] = useState<string | null>(null);
  const { getPairingCode, ...pairs } = usePairs();

  const { text } = useTheme();
  const { confirmPair } = usePairing();

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

  return (
    <View
      style={{
        padding: 30,
        justifyContent: "center",
        rowGap: 20,
        height: "100%",
      }}
    >
      <Label>
        Pairing requested by{" "}
        <Label style={{ fontSize: text.size.large }}>{pairName}</Label>
      </Label>
      <Button onPress={confirmPair} title="Pair" />
    </View>
  );
};
