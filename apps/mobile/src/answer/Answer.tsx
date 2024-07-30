import {
  View,
  TextInput,
  Pressable,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import { AnswerDto } from "@uaguape/common";
import { Label } from "../shared/components/label/Label";
import { useTheme } from "../shared/context/ThemeProvider";

export const QuestionAnswer = ({
  answer,
  onAnswerSend,
  onAnswerChange,
  isLoading,
}: {
  answer: string;
  onAnswerChange: (answer: string) => void;
  onAnswerSend: () => void;
  isLoading: boolean;
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={{
        borderRadius: 10,
        backgroundColor: "white",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
      }}
    >
      <TextInput
        value={answer}
        placeholder="Answer..."
        onChangeText={onAnswerChange}
        style={{ color: colors.text }}
        placeholderTextColor={colors.text}
      />
      <Pressable
        style={{
          borderColor: "black",
          borderWidth: 1,
          borderRadius: 10,
          marginVertical: 10,
        }}
        onPress={onAnswerSend}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Label style={{ color: colors.text, padding: 10 }}>Send</Label>
        )}
      </Pressable>
    </View>
  );
};

export const Answer = (answer: AnswerDto) => {
  const { colors, text } = useTheme();
  const { width } = useWindowDimensions();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.border,
        columnGap: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: width * 0.95,
        alignItems: "center",
      }}
    >
      <Label style={{ fontWeight: "bold", fontSize: text.size.medium }}>
        {answer.user.name}
      </Label>
      <Label style={{ fontSize: text.size.small, flexShrink: 1 }}>
        {answer.content}
      </Label>
    </View>
  );
};
