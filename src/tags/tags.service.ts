import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectRepository } from "@nestjs/typeorm";
import { Tag } from "./entities/tag.entity";
import { Repository } from "typeorm";

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {
  }
  async create(createTagDto: CreateTagDto) {
    return await this.tagRepository.save(createTagDto);
  }

  findAll() {
    return `This action returns all tags`;
  }

  async findOne(id: number) {
    if ( ! await this.isExistTag(id)){
      throw new NotFoundException( `Không tìm thấy tag với id: ${id}` );
    }
    return await this.tagRepository.findOneById(id);
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
    if ( ! await this.isExistTag(id)){
      throw new NotFoundException( `Không tìm thấy tag với id: ${id}` );
    }
    return await this.tagRepository.update(id, updateTagDto);
  }

  async remove(id: number) {
    if ( ! await this.isExistTag(id)){
      throw new NotFoundException( `Không tìm thấy tag với id: ${id}` );
    }
    return await this.tagRepository.update(id, { isDeleted: true, deletedAt: new Date() });
  }

  isExistTag = async (id: number) => {
    return await this.tagRepository.findOneById(id);
  }
}
