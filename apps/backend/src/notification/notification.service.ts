import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import config from '../../firebase.config.json';

@Injectable()
export class NotificationService {
  private readonly messaging: admin.messaging.Messaging;

  constructor() {;
    const client = admin.initializeApp({
      credential: admin.credential.cert(config as admin.ServiceAccount),
    });
    this.messaging = client.messaging();
  }

  async create() {
    return this.messaging.send({
      token: '',
      notification: { body: 'Test', title: 'Test Title' },
    });
  }
}
