import { Injectable } from '@nestjs/common';
import { Server } from 'net';

@Injectable()
export class WebsocketService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  send(event: string, message: any) {
    this.server.emit(event, message);
  }
}
