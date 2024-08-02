import { useTheme } from "@react-navigation/native";
import { QuestionDto } from "@uaguape/common";
import { Pressable } from "react-native";
import { Label } from "../../../shared/components/label/Label";

export const DailyQuestion = ({
  onPress,
  ...question
}: QuestionDto & { onPress: () => void }) => {
  const { colors } = useTheme();
  return (
    <Pressable
      style={{
        backgroundColor: colors.background,
        borderRadius: 5,
        rowGap: 10,
        padding: 10,
        elevation: 5,
      }}
      onPress={onPress}
    >
      <Label>{question.description}</Label>
    </Pressable>
  );
};
