import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Flex, Font } from "@styling";

export const useStyle = () => {
  const { colors } = useTheme();

  return StyleSheet.create({
    container: {
      backgroundColor: colors.border,
      borderRadius: 5,
      rowGap: Flex.rowGap.medium,
      padding: 10,
      elevation: 5,
      width: "90%",
      height: "30%",
      justifyContent: "center",
      alignItems: "center",
    },
    description: { fontSize: Font.size.large },
  });
};
