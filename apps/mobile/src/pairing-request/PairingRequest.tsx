import { Button, View } from "react-native";
import { PairingRequestProps } from "../shared/types/screen-props";
import { Label } from "../shared/components/label/Label";
import { useFont } from "../shared/context/ThemeProvider";
import { usePairing } from "./hooks/pairing.hook";

export const PairingRequest = ({ route }: PairingRequestProps) => {
  const { pairId } = route.params;
  const { pairName, confirmPair } = usePairing(pairId);
  const font = useFont();

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
        <Label style={{ fontSize: font.size.large }}>{pairName}</Label>
      </Label>
      <Button onPress={confirmPair} title="Pair" />
    </View>
  );
};
