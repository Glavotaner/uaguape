import { Injectable } from '@nestjs/common';
import { PrismaService } from 'uaguape-db';
import { Prisma } from '@prisma/client';

@Injectable()
export class PairService {
  private readonly _user: Prisma.UserDelegate;

  constructor(prismaService: PrismaService) {
    this._user = prismaService.user;
  }

  async update(id: string, updateUserDto: { pairId: string }) {
    await this._user.update({
      where: { id },
      data: { pairId: updateUserDto.pairId },
    });
    await this._user.update({
      where: { id: updateUserDto.pairId },
      data: { pairId: id },
    });
  }

  findOne(id: string) {
    return this._user.findUnique({ where: { id }, select: { name: true } });
  }

  generatePairCode(userId: string) {
    return `uaguape://pair/${userId}`;
  }
}
