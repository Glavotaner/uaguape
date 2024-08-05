import { useTheme } from "@react-navigation/native";
import { QuestionDto } from "@uaguape/common";
import { Pressable } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { useFont } from "../../../shared/context/ThemeProvider";

export const DailyQuestion = ({
  onPress,
  ...question
}: QuestionDto & { onPress: () => void }) => {
  const { colors } = useTheme();
  const font = useFont();
  return (
    <Pressable
      style={{
        backgroundColor: colors.border,
        borderRadius: 5,
        rowGap: 10,
        padding: 10,
        elevation: 5,
        width: "90%",
        height: "30%",
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Label style={{ fontSize: font.size.large }}>
        {question.description}
      </Label>
    </Pressable>
  );
};
