import { AnswerDto, CreateAnswerDto } from "@uaguape/common";
import { useApi } from "../context/ApiProvider";
import { AnswerRoutes } from "@uaguape/routes";

export const useAnswers = () => {
  const { answers } = useApi();

  return {
    answers: (questionId: string) => answers.get<AnswerDto[]>(questionId),
    create: (questionId: string, data: CreateAnswerDto) =>
      answers.post<AnswerDto[], AnswerDto[], CreateAnswerDto>(
        AnswerRoutes.QUESTION_ID.replace(":id", questionId),
        data
      ),
  };
};
