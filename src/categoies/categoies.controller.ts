import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from "@nestjs/common";
import { CategoriesService } from './categoies.service';
import { CreateCategoryDto } from './dto/create-categoy.dto';
import { UpdateCategoryDto } from './dto/update-categoy.dto';
import { ResponseMessage } from "../utils/decorators/response_message.decorator";

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ResponseMessage("Tạo danh mục")
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Put(':id')
  @ResponseMessage("Cập nhật danh mục")
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
