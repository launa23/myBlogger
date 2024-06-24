import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { createMongooseAsyncProviders } from "@nestjs/mongoose/dist/mongoose.providers";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { UsersService } from "../users/users.service";
import { PostsService } from "../posts/posts.service";

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository : Repository<Comment>,
    private readonly userService : UsersService,
    private readonly postService: PostsService
  ) {
  }
  async create(createCommentDto: CreateCommentDto, userId: number) {
    const [user, post, parentComment] = await Promise.all([
      this.userService.findOne(userId),
      this.postService.findOne(createCommentDto.postId),
      createCommentDto.parentId ? this.findOne(createCommentDto.parentId, "Không tìm thấy comment mà bạn muốn trả lời ") : null,
    ]);

    const commentData = {
      content: createCommentDto.content,
      user,
      parent: parentComment,
      post,
    };

    const comment = await this.commentRepository.save(commentData);

    return {
      id: comment.id,
      content: comment.content,
      userId: comment.user.id,
      postId: comment.post.id,
      createdAt: comment.createdAt,
    };
  }

  findAll() {
    return `This action returns all comments`;
  }

  async findOne(id: number, message: string) {
    const comment = await this.commentRepository.findOneBy({id: id});
    if ( !comment ){
      throw new NotFoundException(message);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    let post = await this.postService.findOne(updateCommentDto.postId);
    await this.findOne(id, `Không tìm thấy comment với id là ${id}`);
    return await this.commentRepository.update({id: id},{content: updateCommentDto.content})
  }

  async remove(id: number) {
    await this.findOne(id, `Không tìm thấy comment với id là ${id}`);
    return await this.commentRepository.update({id: id},{isDeleted: true, deletedAt: new Date()})
  }
}
