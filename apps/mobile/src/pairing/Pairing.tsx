import { Button, Share, View } from "react-native";
import { PairingProps } from "../shared/types/screen-props";
import { usePairs } from "../shared/hooks/pairs";

export const Pairing = ({ navigation }: PairingProps) => {
  const { getPairingCode } = usePairs();

  const generatePairingCode = async () => {
    const pairingUrl = await getPairingCode();
    const result = await Share.share(
      {
        message: `Click on this link to join me! ${pairingUrl}`,
      },
      { dialogTitle: "Send this to someone so they can join you!" }
    );
    if (result.action === Share.sharedAction) {
      navigation.goBack();
    }
  };

  return (
    <View style={{ height: "100%", justifyContent: "center", padding: 20 }}>
      <Button title="Generate code" onPress={generatePairingCode} />
    </View>
  );
};
