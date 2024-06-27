import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { UpdateCommentDto } from "./dto/update-comment.dto";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../utils/app.constant";
import { Public } from "../utils/decorators/public.decorator";

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @Roles(Role.USER)
  create(@Body() createCommentDto: CreateCommentDto, @User() user: IUser) {
    return this.commentsService.create(createCommentDto, user.id);
  }

  @Public()
  @Get('post/:id')
  @ResponseMessage('Lấy bình luận của một bài viết')
  findAll(@Param('id') id: string) {
    return this.commentsService.findAllByPost(+id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id, "commemt");
  }

  @Roles(Role.USER)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto, @User() user :IUser) {
    return this.commentsService.update(+id, updateCommentDto, user);
  }

  @Roles(Role.USER, Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string, @User() user :IUser) {
    return this.commentsService.remove(+id, user);
  }
}
