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
} from "@uaguape/common";
import axios from "axios";
import { Answer, QuestionAnswer } from "../answer/Answer";
import { Label } from "../shared/components/label/Label";
import { HomeProps, QuestionProps } from "../shared/types/screen-props";
import { useTheme } from "../shared/context/ThemeProvider";
import { useMessaging } from "../shared/hooks/messaging";
import { useQuestions } from "../shared/hooks/questions";
import { useAnswers } from "../shared/hooks/answers";

const useDailyQuestion = ({ navigation }: HomeProps) => {
  const [dailyQuestion, setDailyQuestion] = useState<QuestionDto | null>(null);
  const questions = useQuestions();

  useMessaging();

  const fetchDailyQuestion = async () => {
    try {
      const question = await questions.daily();
      setDailyQuestion(question);
      navigation.navigate("Question", { id: question.id });
    } catch (error) {
      console.warn(error);
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
  const [isLoading, setIsLoading] = useState(false);
  const questions = useQuestions();
  const answers = useAnswers();

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      await getQuestion();
      setIsLoading(false);
    };
    fetchQuestion();
  }, [id]);

  const getQuestion = async () => {
    try {
      const response = await questions.get(id);
      setQuestion(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  const answerQuestion = useCallback(async () => {
    setIsLoading(true);
    await answers.create(id, {
      content: answer,
    });
    await getQuestion();
    setIsLoading(false);
  }, [answer, id]);

  return {
    question,
    answer,
    onAnswerChange: setAnswer,
    answerQuestion,
    isLoading,
  };
};

export const Question = ({ route: { params } }: QuestionProps) => {
  const { question, answer, onAnswerChange, answerQuestion, isLoading } =
    useQuestion(params.id);

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
          isLoading={isLoading}
        />
      </View>
    </View>
  ) : (
    <ActivityIndicator />
  );
};
