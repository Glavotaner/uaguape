import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TokenizedUserDto } from 'uaguape-common';

export const GetUser = createParamDecorator<TokenizedUserDto>(
  (_, ctx: ExecutionContext) => {
    return ctx.switchToHttp().getRequest().user;
  },
);
