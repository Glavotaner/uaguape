import { Injectable } from '@nestjs/common';
import { PrismaService } from 'uaguape-db';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class PairService {
  private readonly _user: Prisma.UserDelegate;

  constructor(prismaService: PrismaService, private readonly notificationService: NotificationService) {
    this._user = prismaService.user;
  }

  async update(id: string, {pairId}: { pairId: string }) {
    await this._user.update({
      where: { id },
      data: { pairId },
    });
    await this._user.update({
      where: { id: pairId },
      data: { pairId: id },
    });
    const [user, pair] = await Promise.all([
      this._user.findUnique({ where: { id: pairId }, select: { name: true } }),
      this._user.findUnique({ where: { id }, select: { pushToken: true } }),
    ]);
    
    if (pair.pushToken) {
      this.notificationService.create({token: pair.pushToken, title: 'Pairing', body: `You have been paired with ${user.name}`});
    }
  }

  findOne(id: string) {
    return this._user.findUnique({ where: { id }, select: { name: true } });
  }

  generatePairCode(userId: string) {
    return `uaguape://pair/${userId}`;
  }
}
