import { Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EntityManager, Repository, Transaction } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostcategoryService } from 'src/postcategory/postcategory.service';
import { CategoriesService } from 'src/categoies/categoies.service';
import { PostCategory } from 'src/postcategory/entities/postcategory.entity';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postCategoryService: PostcategoryService,
    private readonly categoryService: CategoriesService
  ) { }

  async create( createPostDto: CreatePostDto) {
    createPostDto.categories.forEach( async categoryID => {
      const isExistCategory = await this.categoryService.isExistCategory(categoryID);
      if (!isExistCategory) {
        throw new NotFoundException(`Không tìm thấy category với id: ${categoryID}`)
      }
    });

   
    return await this.postRepository.save(createPostDto);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

  async isExistPost(id: number) {
    return await this.postRepository.findOneById(id);
  }
}
