import { Injectable } from '@nestjs/common';
import { TokenizedUserDto, UpdateUserDto } from '@uaguape/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '@uaguape/db';

@Injectable()
export class UserService {
  private readonly _user: Prisma.UserDelegate;

  constructor(prismaService: PrismaService) {
    this._user = prismaService.user;
  }

  user(id: string) {
    return this._user.findUnique({ where: { id } });
  }

  create({ email, name, picture }: TokenizedUserDto) {
    // TODO fix oauth scopes
    const dto = { email, name, picture };
    return this._user.upsert({
      create: dto,
      update: dto,
      where: { email },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this._user.update({
      data,
      where: { id },
    });
  }
}
