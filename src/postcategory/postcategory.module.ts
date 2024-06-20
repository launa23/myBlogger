import { Module, forwardRef } from '@nestjs/common';
import { PostcategoryService } from './postcategory.service';
import { PostcategoryController } from './postcategory.controller';
import { PostCategory } from './entities/postcategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsService } from 'src/posts/posts.service';
import { CategoriesModule } from 'src/categoies/categoies.module';

@Module({
  imports: [TypeOrmModule.forFeature([PostCategory])],
  controllers: [PostcategoryController],
  providers: [PostcategoryService],
  exports: [PostcategoryService]
})
export class PostcategoryModule { }
