import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@uaguape/db';
import { Prisma } from '@prisma/client';
import { endOfDay, startOfDay } from 'date-fns';

@Injectable()
export class QuestionService {
  private readonly _question: Prisma.QuestionDelegate;
  private readonly questionSelect: {
    short: Prisma.QuestionSelect;
  } = {
    short: { id: true, title: true, description: true },
  };

  constructor(prisma: PrismaService) {
    this._question = prisma.question;
  }

  async findOne(id: string, userId: string) {
    const isAnswerOfUserOrPair = {
      OR: [{ userId }, { user: { pairId: userId } }],
    };
    const question = await this._question.findFirstOrThrow({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        answers: {
          select: { user: true, content: true },
          orderBy: { createdAt: 'desc' },
          where: isAnswerOfUserOrPair,
        },
      },
    });
    return {
      ...question,
      answers: question.answers.map((answer) => ({
        ...answer,
        isMyAnswer: answer.user.id === userId,
      })),
    };
  }

  async findDailyQuestion() {
    const now = new Date();
    const dailyQuestion = await this._question.findFirst({
      where: {
        displayedOn: {
          gte: startOfDay(now),
          lte: endOfDay(now),
        },
      },
      select: this.questionSelect.short,
    });
    if (!dailyQuestion) {
      const lastQuestion = await this._question.findFirst({
        select: this.questionSelect.short,
        orderBy: { displayedOn: 'desc' },
      });
      return lastQuestion;
    }
  }

  async setDailyQuestion() {
    const question = await this._question.findFirst({
      where: { displayedOn: null },
    });
    if (!question) {
      throw new InternalServerErrorException('No more questions to display');
    }
    const now = startOfDay(new Date());
    await this._question.update({
      where: { id: question.id },
      data: { displayedOn: now },
    });
  }
}
