import { Injectable, NotFoundException, ParseFilePipeBuilder } from "@nestjs/common";
import { CreateCategoryDto } from './dto/create-categoy.dto';
import { UpdateCategoryDto } from './dto/update-categoy.dto';
import { Repository } from "typeorm";
import { Category } from "./entities/category.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository : Repository<Category>,
  ) {
  }
  async create(createCategoyDto: CreateCategoryDto) {
    return await this.categoryRepository.save(createCategoyDto);
  }

  findAll() {
    return `This action returns all categoies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} categoy`;
  }

  async findByIds(ids: number[]) {
    for(let id of ids){
        if ( ! await this.isExistCategory(id)) {
          throw new NotFoundException(`Không tìm thấy category với id là: ${id}`);
        }
    }
    return this.categoryRepository.findByIds(ids);
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    if (! await this.isExistCategory(id)) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    if (! await this.isExistCategory(id)) {
      throw new NotFoundException(`Không tìm thấy danh mục với id là: ${id}`);
    }
    return await this.categoryRepository.update(id, {isDeleted: true, deletedAt: new Date()});
  }

  async isExistCategory(id: number) {
    return await this.categoryRepository.findOne({ where: { id } });
  }
}
