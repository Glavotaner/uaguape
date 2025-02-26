import { Module } from '@nestjs/common';
import { QuestionSeederModule } from './question-seeder/question-seeder.module';
import { DailyQuestionSetterModule } from './daily-question-setter/daily-question-setter.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [QuestionSeederModule, DailyQuestionSetterModule],
  
})
export class AppModule {}
