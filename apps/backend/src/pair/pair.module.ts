import { Module } from '@nestjs/common';
import { PairController } from './pair.controller';
import { PairService } from './pair.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [PairController],
  providers: [PairService],
})
export class PairModule {}
