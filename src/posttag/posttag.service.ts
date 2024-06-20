import { Injectable } from '@nestjs/common';
import { CreatePosttagDto } from './dto/create-posttag.dto';
import { UpdatePosttagDto } from './dto/update-posttag.dto';

@Injectable()
export class PosttagService {
  create(createPosttagDto: CreatePosttagDto) {
    return 'This action adds a new posttag';
  }

  findAll() {
    return `This action returns all posttag`;
  }

  findOne(id: number) {
    return `This action returns a #${id} posttag`;
  }

  update(id: number, updatePosttagDto: UpdatePosttagDto) {
    return `This action updates a #${id} posttag`;
  }

  remove(id: number) {
    return `This action removes a #${id} posttag`;
  }
}
