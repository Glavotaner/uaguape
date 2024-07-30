import { Command, CommandRunner } from 'nest-commander';
import axios from 'axios';
import { load } from 'cheerio';
import { PrismaService } from '@uaguape/db';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

@Command({
  name: 'seed-questions',
  options: {
    isDefault: true,
  },
})
export class QuestionSeederCommand extends CommandRunner {
  private readonly questions: Prisma.QuestionDelegate<DefaultArgs>;
  private readonly wedge = 'https://www.wedgewoodweddings.com/blog';
  private readonly wedgeBlogs = [
    `${this.wedge}/100-questions`,
    //`${this.wedge}/love-at-home`,
  ];

  constructor(prismaService: PrismaService) {
    super();
    this.questions = prismaService.question;
  }

  async run(
    passedParams: string[],
    options?: Record<string, any>,
  ): Promise<void> {
    try {
      const questionsArrays = await Promise.all(
        this.wedgeBlogs.map(this.parseWedgeBlog),
      );
      const questions = questionsArrays.flat();
      for (const question of questions) {
        const entity = { description: question, title: question };
        await this.questions.upsert({
          where: entity,
          create: entity,
          update: entity,
        });
      }
    } catch (e) {
      throw new Error('Could not seed questions: ' + e.message);
    }
  }

  private readonly parseWedgeBlog = async (url: string) => {
    const { data } = await axios.get(url);

    const $ = load(data);

    const questions = $('ol > li')
      .map((_, question) => $(question).text())
      .toArray();

    return questions;
  };
}
