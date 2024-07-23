import { Body, Controller, Param, Post } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { CreateAnswerDto, TokenizedUserDto } from 'uaguape-common';
import { AnswerRoutes } from 'uaguape-routes';
import { GetUserId } from 'src/global/decorators/user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/global/decorators/user.decorator';

const QUESTION_ID = AnswerRoutes.QUESTION_ID.replace('question/:', '');

@Controller(AnswerRoutes.BASE)
@ApiTags(AnswerRoutes.BASE)
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post(AnswerRoutes.QUESTION_ID)
  create(
    @Body() data: CreateAnswerDto,
    @Param(QUESTION_ID) questionId: string,
    @GetUser() user: TokenizedUserDto,
    @GetUserId() userId: string,
  ) {
    // TODO clean this up
    return this.answerService.create(data, questionId, user, userId);
  }
}
