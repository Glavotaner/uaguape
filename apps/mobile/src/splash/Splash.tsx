import { View, ActivityIndicator } from "react-native";

export const SplashScreen = () => {
  return (
    <View style={{ height: "100%", justifyContent: "center" }}>
      <ActivityIndicator />
    </View>
  );
};
