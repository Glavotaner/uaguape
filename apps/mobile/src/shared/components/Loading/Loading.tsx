import { useTheme } from "@react-navigation/native";
import { ActivityIndicator, DimensionValue } from "react-native";

export const Loading = ({ height = "100%" }: { height?: DimensionValue }) => {
  const { colors } = useTheme();

  return (
    <ActivityIndicator
      style={{ height: height ?? null }}
      size={"large"}
      color={colors.border}
    />
  );
};
