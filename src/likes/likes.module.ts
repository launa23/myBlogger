import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "../users/users.module";
import { Like } from "./entities/like.entity";
import { PostsModule } from "../posts/posts.module";
import { LikeRepository } from "./like.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Like]), UsersModule, PostsModule],
  controllers: [LikesController],
  providers: [LikesService],
  // exports: [LikeRepository]
})
export class LikesModule {}
