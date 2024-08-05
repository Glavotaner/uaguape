import { QuestionDto } from "@uaguape/common";
import { useCallback, useEffect, useState } from "react";
import { useQuestions } from "../../shared/hooks/questions";
import { HomeProps } from "../../shared/types/screen-props";

export const useDailyQuestion = ({ navigation }: HomeProps) => {
  const [dailyQuestion, setDailyQuestion] = useState<QuestionDto | null>(null);
  const questions = useQuestions();

  const fetchDailyQuestion = async () => {
    try {
      const question = await questions.daily();
      setDailyQuestion(question);
    } catch (error) {
      console.warn(error);
    }
  };

  const openQuestion = useCallback(
    () =>
      navigation.navigate("Question", {
        id: dailyQuestion!.id,
      }),
    [dailyQuestion]
  );

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  return { dailyQuestion, openQuestion };
};
