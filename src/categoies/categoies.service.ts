import { Injectable } from '@nestjs/common';
import { CreateCategoyDto } from './dto/create-categoy.dto';
import { UpdateCategoyDto } from './dto/update-categoy.dto';

@Injectable()
export class CategoiesService {
  create(createCategoyDto: CreateCategoyDto) {
    return 'This action adds a new categoy';
  }

  findAll() {
    return `This action returns all categoies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoy`;
  }

  update(id: number, updateCategoyDto: UpdateCategoyDto) {
    return `This action updates a #${id} categoy`;
  }

  remove(id: number) {
    return `This action removes a #${id} categoy`;
  }
}
