import { useTheme } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";

export const Loading = () => {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      style={{ height: "100%" }}
      size={"large"}
      color={colors.border}
    />
  );
};
