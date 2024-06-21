import { Injectable } from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Like } from "./entities/like.entity";
import { DataSource, getRepository, Repository } from "typeorm";
import { UsersService } from "../users/users.service";
import { PostsService } from "../posts/posts.service";
import { Post } from "../posts/entities/post.entity";
import { User } from "../users/entities/user.entity";

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly usersService: UsersService,
    private readonly postsService : PostsService,
    private readonly dataSource: DataSource
  ) {
  }

  async sendLike(createLikeDto: CreateLikeDto, userId: number) {
    const user = await this.usersService.findOne(userId);
    const post = await this.postsService.isExistPost(createLikeDto.postId);
    let isLiked = await this.isLiked(post, user);
    if ( isLiked ){
      return await this.likeRepository.delete(isLiked.id);
    }
    const like = new Like();
    like.user = user;
    like.post = post;
    const liked = await this.likeRepository.save(like);
    return {
      id: liked.id,
      userId: userId,
      postId: post.id
    };
  }

  findAll() {
    return `This action returns all likes`;
  }

  async getUsersWhoLikedPost(postId: number) {
    const likes = await this.likeRepository.createQueryBuilder("likes")
      .where('likes.postId = :postId', { postId })
      .innerJoinAndSelect('like.user', 'user')
      .getOne();

    return likes;
  }

  findOne(id: number) {
    return `This action returns a #${id} like`;
  }

  update(id: number, updateLikeDto: UpdateLikeDto) {
    return `This action updates a #${id} like`;
  }

  remove(id: number) {
    return `This action removes a #${id} like`;
  }

  async isLiked(post: Post, user: User){
    return await this.likeRepository.findOne({
      relations: ['post', 'user'],
      where: {
        post: { id: post.id },
        user: { id: user.id }
      }
    });
  }

}
