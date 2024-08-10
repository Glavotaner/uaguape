import { Font } from "@styling";
import { StyleSheet } from "react-native";

export const useStyle = () => {
  return StyleSheet.create({
    container: {
      padding: 30,
      justifyContent: "center",
      rowGap: 20,
      height: "100%",
    },
    label: {
      fontSize: Font.size.large,
    },
  });
};
