import { QuestionDto } from "@uaguape/common";
import { Pressable } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { useStyle } from "./DailyQuestion.styles";

export const DailyQuestion = ({
  onPress,
  ...question
}: QuestionDto & { onPress: () => void }) => {
  const styling = useStyle();

  return (
    <Pressable style={styling.container} onPress={onPress}>
      <Label style={styling.description}>{question.description}</Label>
    </Pressable>
  );
};
