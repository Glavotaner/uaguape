import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateAnswerDto } from 'uaguape-common';
import { PrismaService } from 'uaguape-db';

@Injectable()
export class AnswerService {
  private readonly _answer: Prisma.AnswerDelegate;
  constructor(prisma: PrismaService) {
    this._answer = prisma.answer;
  }

  create(data: CreateAnswerDto, questionId: string, userId: string) {
    return this._answer.create({ data: { ...data, questionId, userId } });
  }
}
