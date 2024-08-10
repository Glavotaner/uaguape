import { useTheme } from "@react-navigation/native";
import { useWindowDimensions, StyleSheet } from "react-native";
import { AnswerDto } from "@uaguape/common";

export const useAnswerItemStyles = (answer: AnswerDto) => {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const imageSize = 30;

  return StyleSheet.create({
    container: {
      flexDirection: answer.isMyAnswer ? "row-reverse" : "row",
      alignSelf: answer.isMyAnswer ? "flex-end" : "flex-start",
      backgroundColor: colors.border,
      columnGap: 10,
      padding: 10,
      borderRadius: 10,
      maxWidth: width * 0.95,
      alignItems: "center",
      elevation: 5,
    },
    imageStyle: {
      borderRadius: 10,
    },
    imageSize: {
      width: imageSize,
      height: imageSize,
    },
    label: {
      fontSize: 14, // Assuming font.size.small is 14
      flexShrink: 1,
    },
  });
};
