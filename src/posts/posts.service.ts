import { Inject, Injectable, NotFoundException, forwardRef, BadGatewayException, BadRequestException } from "@nestjs/common";
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository, Transaction, TransactionOptions, EntityManager } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostcategoryService } from 'src/postcategory/postcategory.service';
import { CategoriesService } from 'src/categoies/categoies.service';
import { PostCategory } from 'src/postcategory/entities/postcategory.entity';
import { Category } from "../categoies/entities/category.entity";
import { TagsService } from "../tags/tags.service";
import { createMongooseAsyncProviders } from "@nestjs/mongoose/dist/mongoose.providers";
import { IUser } from "../users/user.interface";
import { UsersService } from "../users/users.service";

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly postCategoryService: PostcategoryService,
    private readonly categoryService: CategoriesService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) { }

  async create(createPostDto: CreatePostDto, userId: number) {
      const user = await this.usersService.findOne(userId);
      const tag = await this.tagsService.isExistTag(createPostDto.tagId);
      let categories: Category[] = [];
      for (let categoryID of createPostDto.categories) {
        const isExistCategory = await this.categoryService.isExistCategory(categoryID);
        if (isExistCategory === null || isExistCategory === undefined) {
          throw new BadRequestException(`Không tìm thấy category với id: ${categoryID}`)
        }
        categories.push(isExistCategory);
      }
      ;

      const postDto = new Post();
      postDto.tag = tag;
      postDto.content = createPostDto.content;
      postDto.title = createPostDto.title;
      postDto.user = user;

      const post = await this.postRepository.save(postDto);
    try {
      categories.forEach(async category => {
        let postCategoryService1 = new PostCategory();
        postCategoryService1.category = category;
        postCategoryService1.post = postDto;
        await this.postCategoryService.create(postCategoryService1);
      })
      return {
        title: createPostDto.title,
        content: createPostDto.content,
        categories: categories.map(category => category.name),
        tagName: tag.label
      };
    }
    catch (e){
      await this.postRepository.remove(post);
      throw e;
    }
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
