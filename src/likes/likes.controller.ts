import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { LikesService } from "./likes.service";
import { CreateLikeDto } from "./dto/create-like.dto";
import { UpdateLikeDto } from "./dto/update-like.dto";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { ApiTags } from "@nestjs/swagger";
import { Role } from "../utils/app.constant";
import { Roles } from "../utils/decorators/roles.decorator";

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @ResponseMessage("Like like like...")
  // @Roles(Role.USER)
  create(@Body() createLikeDto: CreateLikeDto, @User() user: IUser) {
    return this.likesService.sendLike(createLikeDto, user.id);
  }

  @Get('post/:id')
  findAllByPost(@Param('id') postId: string) {
    return this.likesService.findAllByPost(+postId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.likesService.findOne(+id);
  }

  @Get()
  findAll() {
    return this.likesService.getAllPost();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLikeDto: UpdateLikeDto) {
    return this.likesService.update(+id, updateLikeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.likesService.remove(+id);
  }
}
