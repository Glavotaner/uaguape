import { QuestionDto, AnswerDto } from "@uaguape/common";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { useMessaging } from "../../shared/context/MessagingProvider";
import { useAnswers } from "../../shared/hooks/answers";
import { useQuestions } from "../../shared/hooks/questions";

export const useQuestion = (id: string) => {
  const [answer, setAnswer] = useState<string>("");
  const [question, setQuestion] = useState<QuestionDto | null>(null);
  const [answers, setAnswers] = useState<AnswerDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const questions = useQuestions();
  const answersApi = useAnswers();
  const { receivedMessage } = useMessaging();

  useEffect(() => {
    const fetchQuestion = async () => {
      setIsLoading(true);
      await Promise.all([getQuestion(), getAnswers()]);
      setIsLoading(false);
    };
    fetchQuestion();
  }, [id]);

  useEffect(() => {
    if (receivedMessage) {
      getAnswers();
    }
  }, [receivedMessage]);

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

  const getAnswers = async () => {
    try {
      const response = await answersApi.answers(id);
      setAnswers(response);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
      }
    }
  };

  const answerQuestion = useCallback(async () => {
    setIsLoading(true);
    await answersApi.create(id, {
      content: answer,
    });
    setAnswer("");
    await getAnswers();
    setIsLoading(false);
  }, [answer, id]);

  return {
    question,
    answer,
    answers,
    onAnswerChange: setAnswer,
    answerQuestion,
    isLoading,
  };
};
