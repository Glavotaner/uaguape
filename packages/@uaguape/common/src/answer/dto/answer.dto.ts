import { UserDto } from "../../user";

export class AnswerDto {
  content!: string;
  user!: UserDto;
  isMyAnswer!: boolean;
}
