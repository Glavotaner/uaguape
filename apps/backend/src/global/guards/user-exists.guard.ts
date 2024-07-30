import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '@uaguape/db';

export const DOES_NOT_REQUIRE_USER = 'doesNotRequireUser';
export const DoesNotRequireUser = () =>
  SetMetadata(DOES_NOT_REQUIRE_USER, true);

@Injectable()
export class UserExistsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const doesNotRequireUser = this.reflector.getAllAndOverride<boolean>(
      DOES_NOT_REQUIRE_USER,
      [context.getHandler(), context.getClass()],
    );

    if (doesNotRequireUser) {
      return true;
    }

    const { email } = context.switchToHttp().getRequest().user ?? {};
    if (!email) {
      return false;
    }

    const user = await this.prismaService.user.findUnique({ where: { email } });
    return user != null;
  }
}
