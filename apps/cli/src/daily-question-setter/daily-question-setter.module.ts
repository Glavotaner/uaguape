import { Module } from '@nestjs/common';
import { PrismaModule } from 'uaguape-db';
import { DailyQuestionSetterCommand } from './daily-question-setter.command';

@Module({
  imports: [PrismaModule],
  providers: [DailyQuestionSetterCommand],
})
export class DailyQuestionSetterModule {}
