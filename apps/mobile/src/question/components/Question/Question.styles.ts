import { Flex, Font } from "@styling";
import { StyleSheet } from "react-native";

export const useStyle = () =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
      rowGap: Flex.rowGap.medium,
    },
    description: { fontWeight: Font.weight.bold, fontSize: Font.size.large },
    answers: { rowGap: Flex.rowGap.medium, padding: 10 },
    answersList: { width: "95%", height: "85%" },
    answerInput: {
      padding: 10,
      paddingTop: 0,
      marginBottom: 20,
      width: "100%",
    },
  });
