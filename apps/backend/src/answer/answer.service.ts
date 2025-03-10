import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { CreateAnswerDto, TokenizedUserDto } from '@uaguape/common';
import { PrismaService } from '@uaguape/db';
import { deepLink } from '@uaguape/linking';
import QuestionPair from './types/question-pair';
import UserAndQuestion from './types/user-and-question';

@Injectable()
export class AnswerService {
  private readonly _answer: Prisma.AnswerDelegate;
  private readonly _user: Prisma.UserDelegate;

  constructor(
    prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    this._answer = prisma.answer;
    this._user = prisma.user;
  }

  async create(
    data: CreateAnswerDto,
    questionId: string,
    user: TokenizedUserDto,
    userId: string,
  ) {
    await this._answer.create({ data: { ...data, questionId, userId } });
    const pair = await this.findQuestionPair({ userId, questionId });
    if (pair?.pushToken != null) {
      this.notifyPairOfQuestionAnswer({ pair, user, questionId });
    }
  }

  private notifyPairOfQuestionAnswer({
    pair,
    user,
    questionId,
  }: {
    pair: QuestionPair;
    user: { name: string };
    questionId: string;
  }) {
    const pairHasAlreadyAnswered = pair.answers.length > 0;
    const message = `${user.name} has answered today's question!`;
    this.notificationService.create({
      notification: {
        title: 'Answer',
        body: pairHasAlreadyAnswered
          ? message
          : `${message} Submit your answer to see theirs!`,
      },
      data: { url: deepLink.Question.link(questionId) },
      token: pair.pushToken,
    });
  }

  async answers(dto: UserAndQuestion) {
    const answers = await this.findAnswersOfUserOrPair(dto);
    return answers.map((answer) => ({
      ...answer,
      isMyAnswer: answer.user.id === dto.userId,
    }));
  }

  private findQuestionPair({ userId, questionId }: UserAndQuestion) {
    return this._user.findUnique({
      where: { pairId: userId },
      select: { pushToken: true, answers: { where: { questionId } } },
    });
  }

  private findAnswersOfUserOrPair({ userId, questionId }: UserAndQuestion) {
    const isAnswerOfUserOrPair = {
      OR: [{ userId }, { user: { pairId: userId } }],
      AND: { questionId },
    };
    return this._answer.findMany({
      select: { user: true, content: true },
      orderBy: { createdAt: 'desc' },
      where: isAnswerOfUserOrPair,
    });
  }
}
