import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import { Font } from "@styling";

export const useStyle = () => {
  const { colors } = useTheme();
  const pairingIconSize = 20;
  return StyleSheet.create({
    scrollView: {
      padding: 20,
    },
    contentContainer: {
      rowGap: 25,
    },
    section: {
      rowGap: 10,
    },
    sectionTitle: {
      fontWeight: "bold",
      fontSize: Font.size.large,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    divider: {
      borderBottomWidth: 1,
    },
    generatePairContainer: {
      padding: 10,
      width: "100%",
    },
    generatePairButton: {
      width: "100%",
      flexDirection: "row",
      backgroundColor: colors.border,
      padding: 10,
      columnGap: 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      elevation: 5,
    },
    generatePairText: {
      fontSize: Font.size.medium,
      fontWeight: "500",
    },
    generatePairIcon: {
      width: pairingIconSize,
      height: pairingIconSize,
    },
  });
};
