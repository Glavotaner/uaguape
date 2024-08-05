import { AnswerDto } from "@uaguape/common";
import { useWindowDimensions, View, Image } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { useFont } from "../../../shared/context/ThemeProvider";
import { useTheme } from "@react-navigation/native";

export const AnswerItem = (answer: AnswerDto) => {
  const font = useFont();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  return (
    <View
      style={{
        flexDirection: answer.isMyAnswer ? "row-reverse" : "row",
        alignSelf: answer.isMyAnswer ? "flex-end" : "flex-start",
        backgroundColor: colors.border,
        columnGap: 10,
        padding: 10,
        borderRadius: 10,
        maxWidth: width * 0.95,
        alignItems: "center",
      }}
    >
      {answer.user.picture && (
        <Image
          source={{ uri: answer.user.picture }}
          width={30}
          height={30}
          style={{ borderRadius: 10 }}
        />
      )}

      <Label style={{ fontSize: font.size.small, flexShrink: 1 }}>
        {answer.content}
      </Label>
    </View>
  );
};
