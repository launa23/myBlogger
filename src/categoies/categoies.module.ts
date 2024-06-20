import { Module } from '@nestjs/common';
import { CategoiesService } from './categoies.service';
import { CategoiesController } from './categoies.controller';

@Module({
  controllers: [CategoiesController],
  providers: [CategoiesService]
})
export class CategoiesModule {}
