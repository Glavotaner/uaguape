import { QuestionRoutes } from "@uaguape/routes";
import { useApi } from "../context/ApiProvider";
import { QuestionDto } from "@uaguape/common";

export const useQuestions = () => {
  const {
    controllers: { questions },
  } = useApi();

  return {
    get: (id: string) => questions.get<QuestionDto, QuestionDto>(id),
    daily: () => questions.get<QuestionDto, QuestionDto>(QuestionRoutes.DAILY),
  };
};
