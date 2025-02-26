import { Button, View } from "react-native";
import { PairingRequestProps } from "../shared/types/screen-props";
import { Label } from "../shared/components/label/Label";
import { usePairing } from "./hooks/pairing.hook";
import { useStyle } from "./PairingRequest.styles";

export const PairingRequest = ({ route }: PairingRequestProps) => {
  const { pairId } = route.params;
  const { pairName, confirmPair } = usePairing(pairId);
  const styling = useStyle();

  return (
    <View style={styling.container}>
      <Label>
        Pairing requested by <Label style={styling.label}>{pairName}</Label>
      </Label>
      <Button onPress={confirmPair} title="Pair" />
    </View>
  );
};
