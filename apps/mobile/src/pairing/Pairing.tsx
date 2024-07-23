import { Button, Share, View } from "react-native";
import { useApi } from "../shared/context/ApiProvider";
import { PairRoutes } from "uaguape-routes";
import { PairingProps } from "../shared/types/screen-props";

export const Pairing = ({ navigation }: PairingProps) => {
  const { pairs } = useApi();

  const generatePairingCode = async () => {
    const response = await pairs.get(PairRoutes.GENERATE_PAIR_CODE);
    const pairingUrl = response.data;
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
