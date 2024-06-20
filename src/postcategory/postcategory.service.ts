import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePostcategoryDto } from './dto/create-postcategory.dto';
import { UpdatePostcategoryDto } from './dto/update-postcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entities/postcategory.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { CategoriesService } from 'src/categoies/categoies.service';


@Injectable()
export class PostcategoryService {

  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) { }

  async create(createPostcategoryDto: CreatePostcategoryDto) {
    const isExistPost = await this.postService.isExistPost(createPostcategoryDto.postId);
    const isExistCategory = await this.categoryService.isExistCategory(createPostcategoryDto.categoryId);
    if (!isExistPost) {
      throw new NotFoundException(`Không tìm thấy post với id: ${createPostcategoryDto.postId}`);
    }
    else if (!isExistCategory) {
      throw new NotFoundException(`Không tìm thấy category với id: ${createPostcategoryDto.categoryId}`)
    }
    const postcategory = new PostCategory(isExistPost, isExistCategory);
    return this.postCategoryRepository.save(postcategory);
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
