import { View } from "react-native";
import { Loading } from "../shared/components/Loading/Loading";
import { Label } from "../shared/components/label/Label";
import { useFont } from "../shared/context/ThemeProvider";

export const SplashScreen = () => {
  const font = useFont();
  return (
    <View
      style={{
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 20,
      }}
    >
      <Label style={{ fontSize: font.size.large, fontWeight: "bold" }}>
        Getting things ready...
      </Label>
      <Loading height={null} />
    </View>
  );
};
