export enum AnswerRoutes {
  BASE = "answers",
  QUESTION_ID = "question/:id",
  TYPING = `${AnswerRoutes.QUESTION_ID}/typing`,
}
