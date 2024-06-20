import { Injectable } from '@nestjs/common';
import { CreatePostcategoryDto } from './dto/create-postcategory.dto';
import { UpdatePostcategoryDto } from './dto/update-postcategory.dto';

@Injectable()
export class PostcategoryService {
  create(createPostcategoryDto: CreatePostcategoryDto) {
    return 'This action adds a new postcategory';
  }

  findAll() {
    return `This action returns all postcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postcategory`;
  }

  update(id: number, updatePostcategoryDto: UpdatePostcategoryDto) {
    return `This action updates a #${id} postcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} postcategory`;
  }
}
