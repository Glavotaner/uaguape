import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ActivityIndicator,
  Pressable,
  FlatList,
  ListRenderItemInfo,
  Button,
} from "react-native";
import {
  AnswerDto,
  CreateAnswerDto,
  QuestionDetailDto,
  QuestionDto,
} from "uaguape-common";
import { AnswerRoutes, QuestionRoutes } from "uaguape-routes";
import axios from "axios";
import { Answer, QuestionAnswer } from "../answer/Answer";
import { Label } from "../shared/components/label/Label";
import { useApi } from "../shared/context/ApiProvider";
import { HomeProps, QuestionProps } from "../shared/types/screen-props";
import { useTheme } from "../shared/context/ThemeProvider";
import { useMessaging } from "../shared/hooks/messaging";

const useDailyQuestion = ({ navigation }: HomeProps) => {
  const [dailyQuestion, setDailyQuestion] = useState<QuestionDto | null>(null);
  const { questions } = useApi();
  useMessaging();

  const fetchDailyQuestion = async () => {
    try {
      const { data } = await questions.get(QuestionRoutes.DAILY);
      setDailyQuestion(data);
      navigation.navigate("Question", { id: data.id });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  return { dailyQuestion };
};

export const Home = ({ navigation, ...props }: HomeProps) => {
  const { dailyQuestion } = useDailyQuestion({ navigation, ...props });
  const Pair = () => {
    return (
      <View>
        <Button title="Code" onPress={() => navigation.navigate("Pairing")} />
      </View>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: Pair,
    });
  }, []);

  return (
    <View
      style={{
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
      }}
    >
      {dailyQuestion ? (
        <QuestionItem
          {...dailyQuestion}
          onPress={() => {
            navigation.navigate("Question", {
              id: dailyQuestion.id,
            });
          }}
        />
      ) : (
        <ActivityIndicator />
      )}
    </View>
  );
};

const QuestionItem = ({
  onPress,
  ...question
}: QuestionDto & { onPress: () => void }) => {
  const { text, colors } = useTheme();
  return (
    <Pressable
      style={{
        backgroundColor: colors.background,
        borderRadius: 5,
        rowGap: 10,
        padding: 10,
        elevation: 5,
      }}
      onPress={onPress}
    >
      <Label style={{ fontSize: text.size.large }}>{question.title}</Label>
      <Label>{question.description}</Label>
    </Pressable>
  );
};

const useQuestion = (id: string) => {
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<QuestionDetailDto | null>(null);
  const { questions, answers } = useApi();

  useEffect(() => {
    getQuestion();
  }, [id]);

  const getQuestion = async () => {
    try {
      const { data } = await questions.get(id);
      setQuestion(data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  const answerQuestion = useCallback(async () => {
    const dto: CreateAnswerDto = {
      content: answer,
    };
    await answers.post(AnswerRoutes.QUESTION_ID.replace(":id", id), dto);
    getQuestion();
  }, [answer, id]);

  return { question, answer, onAnswerChange: setAnswer, answerQuestion };
};

export const Question = ({ route: { params } }: QuestionProps) => {
  const { question, answer, onAnswerChange, answerQuestion } = useQuestion(
    params.id
  );

  const AnswerItem = useCallback(
    ({ item }: ListRenderItemInfo<AnswerDto>) => {
      const answer = {
        ...item,
        user: { ...item.user, name: item.isMyAnswer ? "Me" : item.user.name },
      };
      return (
        <View
          style={{
            alignSelf: item.isMyAnswer ? "flex-end" : "flex-start",
          }}
        >
          <Answer {...answer} />
        </View>
      );
    },

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
        data={question.answers}
        renderItem={AnswerItem}
        contentContainerStyle={{ rowGap: 10 }}
        style={{ width: "95%", height: "80%" }}
        inverted
      ></FlatList>
      <View
        style={{
          padding: 10,
          paddingVertical: 20,
          marginBottom: 20,
          width: "100%",
        }}
      >
        <QuestionAnswer
          onAnswerChange={onAnswerChange}
          answer={answer}
          onAnswerSend={answerQuestion}
        />
      </View>
    </View>
  ) : (
    <ActivityIndicator />
  );
};
