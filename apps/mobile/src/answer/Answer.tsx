import { View, TextInput, Pressable } from "react-native";
import { AnswerDto } from "uaguape-common";
import { Label } from "../shared/components/label/Label";
import { useTheme } from "../shared/context/ThemeProvider";

export const QuestionAnswer = ({
  answer,
  onAnswerSend,
  onAnswerChange,
}: {
  answer: string;
  onAnswerChange: (answer: string) => void;
  onAnswerSend: () => void;
}) => {
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
        <Label
          style={{ color: "black", paddingHorizontal: 10, paddingVertical: 5 }}
        >
          Send
        </Label>
      </Pressable>
    </View>
  );
};

export const Answer = (answer: AnswerDto) => {
  const { colors, text } = useTheme();
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.border,
        columnGap: 10,
        padding: 10,
        borderRadius: 10,
      }}
    >
      <Label style={{ fontWeight: "bold", fontSize: text.size.large }}>
        {answer.user.name}
      </Label>
      <Label style={{ fontSize: text.size.large }}>{answer.content}</Label>
    </View>
  );
};
