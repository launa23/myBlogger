import { Module } from '@nestjs/common';
import { PosttagService } from './posttag.service';
import { PosttagController } from './posttag.controller';

@Module({
  controllers: [PosttagController],
  providers: [PosttagService]
})
export class PosttagModule {}
