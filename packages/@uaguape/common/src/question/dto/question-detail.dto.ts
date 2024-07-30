import { AnswerDto } from '../../answer';
import { QuestionDto } from './question.dto';

export class QuestionDetailDto extends QuestionDto {
  answers!: AnswerDto[];
}
