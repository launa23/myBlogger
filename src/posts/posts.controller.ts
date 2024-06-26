import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile
} from "@nestjs/common";
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { UpdateCategoriesPostDto } from "./dto/update-categories-post";
import { groupedCategory } from "../utils/transform";
import { QueryResult } from "typeorm";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ResponseMessage("Tạo post")
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return await this.postsService.create(createPostDto, user.id, file.filename);
  }

  @ResponseMessage("Lấy tất cả post")
  @Get()
  async findAll(@Query("currentPage") currentPage: string,
                @Query("limit") limit: string) {
    const result = await this.postsService.findAll(+currentPage, +limit);
    return result.length > 0 ? result : "Không có bài post nào!";
  }

  @ResponseMessage("Lấy ra tất cả bài viết theo danh mục")
  @Get('category')
  getAllByCategory(@Query("categoryName") cateName: string){
    return this.postsService.findByCategory(cateName);
  }

  @ResponseMessage("Lấy ra post theo tag")
  @Get('/tag')
  async getByTag(@Query('tagName') tagName: string) {
    const result = await this.postsService.findByTag(tagName);
    return result.length > 0 ? result : `Không có bài post nào với tag là ${tagName}!`;
  }

  @ResponseMessage("Lấy ra post theo id")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.postsService.getOneById(+id);
    return result.length > 0 ? result : `Không có bài post nào với id là ${id}!`;
  }

  @ResponseMessage("Cập nhật bài viết")
  @Put('content/:id')
  updateContent(@Param('id') id: string,
                @Body() updatePostDto: UpdatePostDto,
                @User() user: IUser) {
    return this.postsService.updateContent(+id, updatePostDto, user);
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
