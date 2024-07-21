import { Command, CommandRunner } from 'nest-commander';
import { PrismaService } from 'uaguape-db';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { InternalServerErrorException } from '@nestjs/common';
import { startOfDay } from 'date-fns';

@Command({
  name: 'set-daily-question',
})
export class DailyQuestionSetterCommand extends CommandRunner {
  private readonly questions: Prisma.QuestionDelegate<DefaultArgs>;

  constructor(prismaService: PrismaService) {
    super();
    this.questions = prismaService.question;
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    // TODO consider separating this into a package
    const question = await this.questions.findFirst({
      where: { displayedOn: null },
    });
    if (!question) {
      throw new InternalServerErrorException('No more questions to display');
    }
    const now = startOfDay(new Date());
    await this.questions.update({
      where: { id: question.id },
      data: { displayedOn: now },
    });
  }

}
