import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostcategoryModule } from 'src/postcategory/postcategory.module';
import { PostCategory } from 'src/postcategory/entities/postcategory.entity';
import { PostcategoryService } from 'src/postcategory/postcategory.service';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), forwardRef(() => PostcategoryModule),],
  controllers: [PostsController],
  providers: [PostsService, PostcategoryService],
  exports: [PostsService]
})
export class PostsModule {}
