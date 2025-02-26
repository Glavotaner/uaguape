import { useTheme } from "@react-navigation/native";
import { ReactNode } from "react";
import { TextStyle, Text } from "react-native";

export const Label = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: TextStyle;
}) => {
  const { colors } = useTheme();
  return <Text style={[{ color: colors.text }, style]}>{children}</Text>;
};
