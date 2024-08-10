import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";

export const useStyle = () => {
  const { colors } = useTheme();
  const sendIconSize = 30;

  return StyleSheet.create({
    container: {
      borderRadius: 10,
      backgroundColor: colors.border,
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 10,
      elevation: 5,
    },
    input: {
      color: colors.text,
      width: "80%",
    },
    sendButton: {
      width: "20%",
      justifyContent: "center",
      alignItems: "flex-end",
    },
    sendIcon: {
      width: sendIconSize,
      height: sendIconSize,
    } as const,
  });
};
