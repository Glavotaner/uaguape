import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import SendIcon from "@icons/send.svg";

export const AnswerInput = ({
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
        backgroundColor: colors.border,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        elevation: 5,
      }}
    >
      <TextInput
        value={answer}
        placeholder="Answer..."
        onChangeText={onAnswerChange}
        style={{ color: colors.text, width: "80%" }}
        placeholderTextColor={colors.text}
      />
      <Pressable
        style={{
          width: "20%",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
        onPress={onAnswerSend}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <SendIcon width={30} height={30} fill={colors.text} />
        )}
      </Pressable>
    </View>
  );
};
