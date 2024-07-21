import { Injectable } from '@nestjs/common';
import { CreateUserDto } from 'uaguape-common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'uaguape-db';

@Injectable()
export class UserService {
  private readonly _user: Prisma.UserDelegate;

  constructor(prismaService: PrismaService) {
    this._user = prismaService.user;
  }

  create(createUserDto: CreateUserDto) {
    // TODO make only create
    return this._user.upsert({
      create: { name: createUserDto.name, email: createUserDto.email },
      update: { name: createUserDto.name, email: createUserDto.email },
      where: { email: createUserDto.email },
    });
  }
}
