import { QuestionRoutes } from "uaguape-routes";
import { useApi } from "../context/ApiProvider";
import { QuestionDetailDto } from "uaguape-common";

export const useQuestions = () => {
  const { questions } = useApi();

  return {
    get: (id: string) =>
      questions.get<QuestionDetailDto, QuestionDetailDto>(id),
    daily: () =>
      questions.get<QuestionDetailDto, QuestionDetailDto>(QuestionRoutes.DAILY),
  };
};
