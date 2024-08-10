import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import SendIcon from "@icons/send.svg";
import { useStyle } from "./AnswerInput.styles";
import { useCallback } from "react";

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
  const styles = useStyle();

  const SendButton = useCallback(
    () => (
      <Pressable style={styles.sendButton} onPress={onAnswerSend}>
        {isLoading ? (
          <ActivityIndicator color={colors.text} />
        ) : (
          <SendIcon {...styles.sendIcon} fill={colors.text} />
        )}
      </Pressable>
    ),
    [onAnswerSend, isLoading]
  );

  return (
    <View style={styles.container}>
      <TextInput
        value={answer}
        placeholder="Answer..."
        onChangeText={onAnswerChange}
        style={styles.input}
        placeholderTextColor={colors.text}
      />
      <SendButton />
    </View>
  );
};
