import { Injectable } from '@nestjs/common';
import { PrismaService } from '@uaguape/db';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PairService {
  private readonly _user: Prisma.UserDelegate;

  constructor(
    prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {
    this._user = prismaService.user;
  }

  async update(id: string, { pairId }: { pairId: string }) {
    const user = await this._user.update({
      where: { id },
      data: { pairId },
      select: { name: true },
    });
    const pair = await this._user.update({
      where: { id: pairId },
      data: { pairId: id },
      select: { pushToken: true },
    });

    if (pair.pushToken) {
      this.notificationService.create({
        notification: {
          title: 'Pairing',
          body: `You have been paired with ${user.name}`,
        },
        token: pair.pushToken,
      });
    }
  }

  findOne(id: string) {
    return this._user.findUnique({ where: { id }, select: { name: true } });
  }

  generatePairCode(userId: string) {
    return `uaguape://pair/${userId}`;
  }
}
