import { Module, forwardRef } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostcategoryModule } from 'src/postcategory/postcategory.module';
import { CategoriesModule } from 'src/categoies/categoies.module';
import { TagsModule } from "../tags/tags.module";
import { UsersModule } from "../users/users.module";
import { LikesModule } from "../likes/likes.module";
import { LikeRepository } from "../likes/like.repository";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "../utils/config/multer.config";

@Module({
  imports: [TypeOrmModule.forFeature([Post]),
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),
    PostcategoryModule,
    CategoriesModule,
    TagsModule,
    UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService]
})
export class PostsModule {}
