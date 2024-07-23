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

  create(dto: CreateUserDto) {
    // TODO fix oauth scopes
    const name = dto.email.includes('marin')
      ? this.configService.get('PERSON_2')
      : this.configService.get('PERSON_1');
    // TODO make only create
    return this._user.upsert({
      create: { ...dto, name },
      update: { ...dto, name },
      where: { email: dto.email },
    });
  }

  update(id: string, data: UpdateUserDto) {
    return this._user.update({
      data,
      where: { id },
    });
  }
}
