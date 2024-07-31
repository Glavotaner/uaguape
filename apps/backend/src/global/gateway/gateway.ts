import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'net';
import { WebsocketService } from './websocket.service';

@WebSocketGateway()
export class WebsocketGateway implements OnGatewayInit {
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  afterInit(server: Server) {
    this.websocketService.setServer(server);
  }
}
