import { Font } from "@styling";
import { StyleSheet } from "react-native";

export const useStyle = () => {
  return StyleSheet.create({
    container: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      rowGap: 20,
    },
    label: {
      fontSize: Font.size.large,
      fontWeight: "bold",
    },
  });
};
