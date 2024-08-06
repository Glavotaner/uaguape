import { AnswerDto, CreateAnswerDto } from "@uaguape/common";
import { useApi } from "../context/ApiProvider";
import { AnswerRoutes } from "@uaguape/routes";

export const useAnswers = () => {
  const {
    controllers: { answers },
  } = useApi();

  const questionIdUrl = (questionId: string) =>
    AnswerRoutes.QUESTION_ID.replace(":id", questionId);

  return {
    answers: (questionId: string) =>
      answers.get<AnswerDto[], AnswerDto[]>(questionIdUrl(questionId)),
    create: (questionId: string, data: CreateAnswerDto) =>
      answers.post<AnswerDto[], AnswerDto[], CreateAnswerDto>(
        questionIdUrl(questionId),
        data
      ),
  };
};
