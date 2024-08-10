import { AnswerDto } from "@uaguape/common";
import { useCallback } from "react";
import { ListRenderItemInfo, View, FlatList } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { QuestionProps } from "../../../shared/types/screen-props";
import { useQuestion } from "../../hooks/question.hook";
import { AnswerItem } from "../../../answer/components/AnswerItem/AnswerItem";
import { AnswerInput } from "../../../answer/components/AnswerInput/AnswerInput";
import { Loading } from "../../../shared/components/Loading/Loading";
import { useStyle } from "./Question.styles";

export const Question = ({ route: { params } }: QuestionProps) => {
  const {
    question,
    answer,
    answers,
    onAnswerChange,
    answerQuestion,
    isLoading,
  } = useQuestion(params.id);

  const Answer = useCallback(
    ({ item }: ListRenderItemInfo<AnswerDto>) => <AnswerItem {...item} />,
    []
  );

  const styles = useStyle();

  return question ? (
    <View style={styles.container}>
      <Label style={styles.description}>{question.description}</Label>
      <FlatList
        data={answers}
        renderItem={Answer}
        contentContainerStyle={styles.answers}
        style={styles.answersList}
        inverted
      ></FlatList>
      <View style={styles.answerInput}>
        <AnswerInput
          onAnswerChange={onAnswerChange}
          answer={answer}
          onAnswerSend={answerQuestion}
          isLoading={isLoading}
        />
      </View>
    </View>
  ) : (
    <Loading />
  );
};
