import { Body, Controller, Param, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from 'uaguape-common';
import { AnswerRoutes } from 'uaguape-routes';
import { GetUserId } from 'src/global/decorators/user-id.decorator';

const QUESTION_ID = AnswerRoutes.QUESTION_ID.replace(':', '');

@Controller(AnswerRoutes.BASE)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post(AnswerRoutes.QUESTION_ID)
  create(
    @Body() data: CreateAnswerDto,
    @Param(QUESTION_ID) questionId: string,
    @GetUserId() userId: string,
  ) {
    return this.answerService.create(data, questionId, userId);
  }
}
