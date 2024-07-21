import { Controller, Get, Param, Patch } from '@nestjs/common';
import { PairRoutes } from 'uaguape-routes';
import { GetUserId } from 'src/global/decorators/user-id.decorator';
import { PairService } from './pair.service';

const PAIR_ID = PairRoutes.ID.replace(':', '');

@Controller(PairRoutes.BASE)
export class PairController {
  constructor(private readonly service: PairService) {}

  @Get(PairRoutes.GENERATE_PAIR_CODE)
  generatePairCode(@GetUserId() id: string) {
    return this.service.generatePairCode(id);
  }

  @Get(PairRoutes.ID)
  findPair(@Param(PAIR_ID) pairId: string) {
    return this.service.findOne(pairId);
  }

  @Patch(PairRoutes.ID)
  setPair(@GetUserId() id: string, @Param(PAIR_ID) pairId: string) {
    return this.service.update(id, { pairId });
  }
}
