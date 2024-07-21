import { Controller, Get, Param, PipeTransform } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionRoutes } from 'uaguape-routes';
import { GetUserId } from 'src/global/decorators/user-id.decorator';

const QUESTION_ID = QuestionRoutes.ID.replace(':', '');

@Controller(QuestionRoutes.BASE)
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get(QuestionRoutes.DAILY)
  findDailyQuestion() {
    return this.questionService.findDailyQuestion();
  }

  @Get(QuestionRoutes.ID)
  findOne(@Param(QUESTION_ID) id: string, @GetUserId() userId: string) {
    return this.questionService.findOne(id, userId);
  }
}
