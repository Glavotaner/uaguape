import { View } from "react-native";
import { Loading } from "../shared/components/Loading/Loading";
import { Label } from "../shared/components/label/Label";
import { useStyle } from "./Splash.styles";

export const SplashScreen = () => {
  const styling = useStyle();
  return (
    <View style={styling.container}>
      <Label style={styling.label}>Getting things ready...</Label>
      <Loading height={null} />
    </View>
  );
};
