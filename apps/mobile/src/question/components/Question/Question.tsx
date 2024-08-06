import { AnswerDto } from "@uaguape/common";
import { useCallback } from "react";
import { ListRenderItemInfo, View, FlatList } from "react-native";
import { Label } from "../../../shared/components/label/Label";
import { QuestionProps } from "../../../shared/types/screen-props";
import { useQuestion } from "../../hooks/question.hook";
import { AnswerItem } from "../../../answer/components/AnswerItem/AnswerItem";
import { AnswerInput } from "../../../answer/components/AnswerInput/AnswerInput";
import { Loading } from "../../../shared/components/Loading/Loading";

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

  return question ? (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        rowGap: 10,
      }}
    >
      <Label style={{ fontWeight: "bold", fontSize: 18 }}>
        {question.description}
      </Label>
      <FlatList
        data={answers}
        renderItem={Answer}
        contentContainerStyle={{ rowGap: 10, padding: 10 }}
        style={{ width: "95%", height: "85%" }}
        inverted
      ></FlatList>
      <View
        style={{
          padding: 10,
          paddingTop: 0,
          marginBottom: 20,
          width: "100%",
        }}
      >
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
