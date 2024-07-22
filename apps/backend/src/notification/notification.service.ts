import { Injectable } from '@nestjs/common';
import { initializeApp, credential, app, messaging } from 'firebase-admin';

@Injectable()
export class NotificationService {
  private readonly messaging: messaging.Messaging;

  constructor() {
    const client = initializeApp({
      credential: credential.cert('../firebase.config.json'),
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
