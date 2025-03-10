import { AnswerService } from "@answer/answer.service";

type QuestionPair = Awaited<ReturnType<AnswerService['findQuestionPair']>>

export default QuestionPair;