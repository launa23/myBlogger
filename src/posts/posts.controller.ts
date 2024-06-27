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
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../utils/app.constant";
import { Public } from "../utils/decorators/public.decorator";

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ResponseMessage("Tạo post")
  @Post()
  @UseInterceptors(FileInterceptor('thumbnail'))
  // @Roles(Role.USER)
  async create(@UploadedFile() file: Express.Multer.File, @Body() createPostDto: CreatePostDto, @User() user: IUser) {
    return await this.postsService.create(createPostDto, user.id, file.filename);
  }

  @Public()
  @ResponseMessage("Lấy tất cả post")
  @Get()
  async findAll(@Query("currentPage") currentPage: string,
                @Query("limit") limit: string) {
    const result = await this.postsService.findAll(+currentPage, +limit);
    // return result.length > 0 ? result : "Không có bài post nào!";
    return result;

  }

  @Public()
  @ResponseMessage("Lấy ra tất cả bài viết theo danh mục")
  @Get('category')
  getAllByCategory(@Query("categoryName") cateName: string){
    return this.postsService.findByCategory(cateName);
  }

  @Public()
  @ResponseMessage("Lấy ra post theo tag")
  @Get('/tag')
  async getByTag(@Query('tagName') tagName: string) {
    const result = await this.postsService.findByTag(tagName);
    return result.length > 0 ? result : `Không có bài post nào với tag là ${tagName}!`;
  }

  @Public()
  @ResponseMessage("Lấy ra post theo id")
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.postsService.getOneById(+id);
    return result.length > 0 ? result : `Không có bài post nào với id là ${id}!`;
  }

  @ResponseMessage("Cập nhật bài viết")
  @Put('content/:id')
  @Roles(Role.USER)
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

  @Roles(Role.USER, Role.ADMIN)
  @ResponseMessage("Xóa bài post")
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }
}
