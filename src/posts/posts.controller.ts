import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from "@nestjs/common";
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { UpdateCategoriesPostDto } from "./dto/update-categories-post";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ResponseMessage("Tạo post")
  @Post()
  async create(@Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return await this.postsService.create(createPostDto, user.id);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
  @ResponseMessage("Cập nhật bài viết")
  @Put('content/:id')
  updateContent(@Param('id') id: string,
                @Body() updatePostDto: UpdatePostDto,
                @User() user: IUser) {
    return this.postsService.updateContent(+id, updatePostDto, user);
  }

  @ResponseMessage("Lấy ra tất cả bài viết của một user")
  @Get('user/:userId')
  getAllByUser(@Param('userId') userId: number){
    return this.postsService.findAllByUserId(userId);
  }


  @ResponseMessage("Cập nhật danh mục bài viết")
  @Put('categories/:id')
  updateCategories(@Param('id') id: string, @Body() updatePostDto: UpdateCategoriesPostDto) {
    return this.postsService.updateCategories(+id, updatePostDto);
  }

  @ResponseMessage("Xóa bài post")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
