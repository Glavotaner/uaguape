import { AnswerDto } from "@uaguape/common";
import { View, Image } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { useAnswerItemStyles } from "./AnswerItem.styles";

export const AnswerItem = (answer: AnswerDto) => {
  const styles = useAnswerItemStyles(answer);

  return (
    <View style={styles.container}>
      {answer.user.picture && (
        <Image
          source={{ uri: answer.user.picture }}
          {...styles.imageSize}
          style={styles.imageStyle}
        />
      )}

      <Label style={styles.label}>{answer.content}</Label>
    </View>
  );
};
