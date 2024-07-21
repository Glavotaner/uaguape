import { Button, ToastAndroid, View } from "react-native";
import { useApi } from "../shared/context/ApiProvider";
import Clipboard from "@react-native-clipboard/clipboard";
import { PairRoutes } from "uaguape-routes";
import { PairingProps } from "../shared/types/screen-props";

export const Pairing = ({ navigation }: PairingProps) => {
  const { pairs } = useApi();

  const generatePairingCode = async () => {
    const { data } = await pairs.get(PairRoutes.GENERATE_PAIR_CODE);
    if (data) {
      Clipboard.setString(data);
      navigation.goBack();
      ToastAndroid.show("Pairing code copied to clipboard", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={{ height: "100%", justifyContent: "center", padding: 20 }}>
      <Button title="Generate code" onPress={generatePairingCode} />
    </View>
  );
};
