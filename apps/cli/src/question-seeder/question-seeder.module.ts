import { Module } from '@nestjs/common';
import { QuestionSeederCommand } from './question-seeder.command';
import { PrismaModule } from '@uaguape/db';

@Module({
  imports: [PrismaModule],
  providers: [QuestionSeederCommand],
})
export class QuestionSeederModule {}
