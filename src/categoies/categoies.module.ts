import { Module } from '@nestjs/common';
import { CategoriesService } from './categoies.service';
import { CategoriesController } from './categoies.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule {}
