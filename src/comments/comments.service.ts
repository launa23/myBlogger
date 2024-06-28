import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Comment } from "./entities/comment.entity";
import { UsersService } from "../users/users.service";
import { PostsService } from "../posts/posts.service";
import { buildCommentTree } from "../utils/transform";
import { IUser } from "../users/user.interface";
import { Role } from "../utils/app.constant";

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
    if ( parentComment && parentComment.post.id !== createCommentDto.postId ) {
      throw new BadRequestException("Không thể bình luận! ");
    }
    const commentData = new Comment();
    commentData.content = createCommentDto.content;
    commentData.user = user;
    commentData.parent = parentComment;
    commentData.post = post;
    const comment = await this.commentRepository.save(commentData);
    return {
      id: comment.id,
      content: comment.content,
      userId: comment.user.id,
      postId: comment.post.id,
      createdAt: comment.createdAt,
    };
  }

  async findAllByPost(id: number, limit: number, currentPage: number, parent_id?: number) {
    const qb = this.queryBuilder(limit, currentPage);
    const qbTotal = this.commentRepository
      .createQueryBuilder("cmt")
      .where('cmt.isDeleted is false')
      .leftJoinAndSelect('cmt.post', 'post');
    let comments = [];
    let total = 0;
    if (!parent_id){
      comments = await qb.andWhere(' post.id = :id and parent.id is null', {id}).getRawMany();
      total = await qbTotal.andWhere(' post.id = :id and parent_id is null', {id}).getCount();
    }
    else {
      comments = await qb.andWhere(' post.id = :id and parent.id = :parent_id', {id, parent_id}).getRawMany();
      total = await qbTotal.andWhere(' post.id = :id and parent_id = :parent_id', {id, parent_id}).getCount();
    }
    return {
      post_id: id,
      total_comment: total,
      total_page: Math.ceil(total / limit),
      current_page: currentPage,
      limit: limit,
      comments: comments
    };
  }


  async findOne(id: number, message: string) {
    const comment = await this.commentRepository.findOneBy({id: id});
    if ( !comment ){
      throw new NotFoundException(message);
    }
    return comment;
  }

  async update(id: number, updateCommentDto: UpdateCommentDto, user: IUser) {
    const post = await this.postService.findOne(updateCommentDto.postId);
    const comment = await this.findOne(id, `Không tìm thấy comment với id là ${id}`);
    if(comment.user.id !== user.id){
      throw new BadRequestException("Bạn không thể sửa bình luận này!")
    }
    return await this.commentRepository.update({id: id},{content: updateCommentDto.content})
  }

  async remove(id: number, user: IUser) {
    const comment = await this.findOne(id, `Không tìm thấy comment với id là ${id}`);
    if( comment.user.id !== user.id && user.role !== Role.ADMIN ){
      throw new BadRequestException("Bạn không thể xóa bình luận này!")
    }
    return await this.commentRepository.update({id: id},{isDeleted: true, deletedAt: new Date()})
  }

  queryBuilder = (limit: number, currentPage :number) => {
    return this.commentRepository.createQueryBuilder('cmt')
      .leftJoinAndSelect('cmt.parent', 'parent')
      .leftJoinAndSelect('cmt.post', 'post')
      .leftJoinAndSelect('cmt.user', 'user')
      .where("cmt.isDeleted is false")
      .select([
        'cmt.id',
        'parent.id',
        'cmt.content',
        'post.title',
        'post.id',
        'user.id',
        'user.name',
        'user.avatar',
        '(SELECT COUNT(*) FROM comment as cmt2 WHERE cmt2.parent_id = cmt.id) AS total_children'
      ])
      .limit(limit)
      .offset(limit*currentPage-limit)
  }
}





