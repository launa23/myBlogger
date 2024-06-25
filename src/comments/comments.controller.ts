import { Controller, Get, Post, Body, Patch, Param, Delete, Put, Query } from "@nestjs/common";
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Get('post/:id')
  @ResponseMessage('Lấy bình luận của một bài viết')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAllByPost(+id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id, "commemt");
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}
