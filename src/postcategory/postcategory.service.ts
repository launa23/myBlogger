import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePostcategoryDto } from './dto/create-postcategory.dto';
import { UpdatePostcategoryDto } from './dto/update-postcategory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCategory } from './entities/postcategory.entity';
import { Repository } from 'typeorm';
import { PostsService } from 'src/posts/posts.service';
import { CategoriesService } from 'src/categoies/categoies.service';
import { Category } from "../categoies/entities/category.entity";
import { Post } from "../posts/entities/post.entity";


@Injectable()
export class PostcategoryService {

  constructor(
    @InjectRepository(PostCategory)
    private readonly postCategoryRepository: Repository<PostCategory>,
  ) { }

  async create(createPostCategoryDto: PostCategory) {
    return await this.postCategoryRepository.save(createPostCategoryDto);
  }

  findAll() {
    return `This action returns all postcategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} postcategory`;
  }

  async findByCategoryID(post: Post){
    return this.postCategoryRepository.findBy({ post })
  }


  update(id: number, updatePostcategoryDto: UpdatePostcategoryDto) {
    return `This action updates a #${id} postcategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} postcategory`;
  }

  async delete(post: Post){
    await this.postCategoryRepository.delete({post})
  }

  async softDelete(post: Post){
    await this.postCategoryRepository.update({post}, {isDeleted: true});
  }
}
