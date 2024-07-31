import { Global, Module } from '@nestjs/common';
import { WebsocketGateway } from './gateway';
import { WebsocketService } from './websocket.service';

@Global()
@Module({
  providers: [WebsocketGateway, WebsocketService],
  exports: [WebsocketService],
})
export class WebsocketModule {}
