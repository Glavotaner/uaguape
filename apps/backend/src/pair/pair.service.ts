import { Injectable } from '@nestjs/common';
import { PrismaService } from '@uaguape/db';
import { Prisma } from '@prisma/client';
import { NotificationService } from 'src/notification/notification.service';
import { deepLink } from '@uaguape/linking';

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
    const [user, pair] = await Promise.all([
      this.connectUserToPair({ id, pairId }),
      this.connectPairToUser({ id, pairId }),
    ]);

    if (pair.pushToken) {
      this.notifyPairOfPairing(user, pair);
    }
  }

  private notifyPairOfPairing(
    user: { name: string },
    pair: { pushToken: string },
  ) {
    this.notificationService.create({
      notification: {
        title: 'Pairing',
        body: `You have been paired with ${user.name}`,
      },
      token: pair.pushToken,
    });
  }

  findOne(id: string) {
    return this._user.findUnique({ where: { id }, select: { name: true } });
  }

  generatePairCode(userId: string) {
    return deepLink.PairingRequest.link(userId);
  }

  private async connectUserToPair({
    id,
    pairId,
  }: {
    id: string;
    pairId: string;
  }) {
    return this._user.update({
      where: { id },
      data: { pairId },
      select: { name: true },
    });
  }

  private async connectPairToUser({
    id,
    pairId,
  }: {
    id: string;
    pairId: string;
  }) {
    return this._user.update({
      where: { id: pairId },
      data: { pairId: id },
      select: { pushToken: true },
    });
  }
}
