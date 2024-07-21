import { Module } from '@nestjs/common';
import { PairController } from './pair.controller';
import { PairService } from './pair.service';

@Module({
  controllers: [PairController],
  providers: [PairService],
})
export class PairModule {}
