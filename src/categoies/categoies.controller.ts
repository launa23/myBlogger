import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoiesService } from './categoies.service';
import { CreateCategoyDto } from './dto/create-categoy.dto';
import { UpdateCategoyDto } from './dto/update-categoy.dto';

@Controller('categoies')
export class CategoiesController {
  constructor(private readonly categoiesService: CategoiesService) {}

  @Post()
  create(@Body() createCategoyDto: CreateCategoyDto) {
    return this.categoiesService.create(createCategoyDto);
  }

  @Get()
  findAll() {
    return this.categoiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoiesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoyDto: UpdateCategoyDto) {
    return this.categoiesService.update(+id, updateCategoyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoiesService.remove(+id);
  }
}
