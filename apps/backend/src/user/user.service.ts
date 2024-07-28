import { Injectable } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from 'uaguape-common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'uaguape-db';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  private readonly _user: Prisma.UserDelegate;

  constructor(
    prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this._user = prismaService.user;
  }

  create({ email, name }: CreateUserDto) {
    // TODO fix oauth scopes

    return this._user.upsert({
      create: { email, name },
      update: { email, name },
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
