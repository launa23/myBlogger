import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PosttagService } from './posttag.service';
import { CreatePosttagDto } from './dto/create-posttag.dto';
import { UpdatePosttagDto } from './dto/update-posttag.dto';

@Controller('posttag')
export class PosttagController {
  constructor(private readonly posttagService: PosttagService) {}

  @Post()
  create(@Body() createPosttagDto: CreatePosttagDto) {
    return this.posttagService.create(createPosttagDto);
  }

  @Get()
  findAll() {
    return this.posttagService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.posttagService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePosttagDto: UpdatePosttagDto) {
    return this.posttagService.update(+id, updatePosttagDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.posttagService.remove(+id);
  }
}
