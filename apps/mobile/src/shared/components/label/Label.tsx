import { ReactNode } from "react";
import { TextStyle, Text } from "react-native";
import { useTheme } from "../../context/ThemeProvider";

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
