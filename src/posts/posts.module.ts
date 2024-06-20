import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostcategoryModule } from 'src/postcategory/postcategory.module';
import { CategoriesModule } from 'src/categoies/categoies.module';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), PostcategoryModule, CategoriesModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
