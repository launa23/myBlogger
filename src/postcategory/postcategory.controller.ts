import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PostcategoryService } from './postcategory.service';
import { CreatePostcategoryDto } from './dto/create-postcategory.dto';
import { UpdatePostcategoryDto } from './dto/update-postcategory.dto';

@Controller('postcategory')
export class PostcategoryController {
  constructor(private readonly postcategoryService: PostcategoryService) {}

  @Post()
  create(@Body() createPostcategoryDto: CreatePostcategoryDto) {
    return this.postcategoryService.create(createPostcategoryDto);
  }

  @Get()
  findAll() {
    return this.postcategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postcategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostcategoryDto: UpdatePostcategoryDto) {
    return this.postcategoryService.update(+id, updatePostcategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postcategoryService.remove(+id);
  }
}
