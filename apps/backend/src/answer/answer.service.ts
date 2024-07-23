import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { CreateAnswerDto, TokenizedUserDto } from 'uaguape-common';
import { PrismaService } from 'uaguape-db';

@Injectable()
export class AnswerService {
  private readonly _answer: Prisma.AnswerDelegate;
  private readonly _user: Prisma.UserDelegate;
  
  constructor(prisma: PrismaService, private readonly notificationService: NotificationService) {
    this._answer = prisma.answer;
    this._user = prisma.user;
  }

  async create(data: CreateAnswerDto, questionId: string, user: TokenizedUserDto, userId: string) {
    await this._answer.create({ data: { ...data, questionId, userId } });
    const pair = await this._user.findUnique({where: {pairId: userId}, select: {pushToken: true, answers: {where: {questionId}}}});
    if (pair.pushToken != null) {
      const pairHasAlreadyAnswered = pair.answers.length > 0;
      const message = `${user.name} has answered today's question!`;
      this.notificationService.create({token: pair.pushToken, title: 'Answer', body: pairHasAlreadyAnswered ? message : `${message} Submit your answer to see theirs!`});
    }
  }
}
