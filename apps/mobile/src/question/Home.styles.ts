import { StyleSheet } from "react-native";

export const useStyle = () => {
  return StyleSheet.create({
    container: {
      alignContent: "center",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    },
  });
};
