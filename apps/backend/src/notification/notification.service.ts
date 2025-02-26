import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import config from '../../firebase.config.json';
import { CreateNotificationDto } from '@uaguape/common';

@Injectable()
export class NotificationService {
  private readonly messaging: admin.messaging.Messaging;

  constructor() {
    const client = admin.initializeApp({
      credential: admin.credential.cert(config as admin.ServiceAccount),
    });
    this.messaging = client.messaging();
  }

  async create({ token, notification, data }: CreateNotificationDto) {
    return this.messaging.send({
      token,
      notification,
      // TODO improve type
      data: data as any,
    });
  }
}
