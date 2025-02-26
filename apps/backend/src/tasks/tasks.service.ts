import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class TasksService {
  constructor(private readonly questionService: QuestionService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Europe/Zagreb' })
  setDailyQuestion() {
    this.questionService.setDailyQuestion();
  }
}
