import { Module } from '@nestjs/common';
import { PostcategoryService } from './postcategory.service';
import { PostcategoryController } from './postcategory.controller';

@Module({
  controllers: [PostcategoryController],
  providers: [PostcategoryService]
})
export class PostcategoryModule {}
