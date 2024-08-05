import { View, TextInput, Pressable, ActivityIndicator } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { useTheme } from "@react-navigation/native";

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
