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
import { UpdateCategoriesPostDto } from "./dto/update-categories-post";

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
        if ( !isExistCategory ) {
          throw new BadRequestException(`Không tìm thấy category với id: ${categoryID}`)
        }
        categories.push(isExistCategory);
      };

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

  async findOne(id: number) {
    let isExistPost = await this.postRepository.findOneById(id);
    if ( !isExistPost ){
      throw new NotFoundException(`Không tìm thấy post với id là: ${id}`);
    }
    return isExistPost;
  }

  async updateContent(id: number, updatePostDto: UpdatePostDto, user: IUser) {
    let post = await this.isExistPost(id);
    let tag = await this.tagsService.isExistTag(updatePostDto.tagId);
    if ( !tag ){
      throw new NotFoundException(`Không tìm thấy tag với id là: ${id}`);
    }
    let postNew = new Post();
    postNew.tag = tag;
    postNew.title = updatePostDto.title;
    postNew.content = updatePostDto.content;
    return await this.postRepository.update({id}, postNew);
  }

  async updateCategories(id: number, updateDto: UpdateCategoriesPostDto){
      let post = await this.isExistPost(id);

      let categories = await this.categoryService.findByIds(updateDto.categories);
      try {
        const postCategories = categories.map( async (category) => {
          const postCategory = new PostCategory();
          postCategory.post = post;
          postCategory.category = category;
          await this.postCategoryService.create(postCategory);
        });
        await this.postCategoryService.delete(post);
        return `Cập nhật thành công danh mục của post: ${id}`;
      }
      catch (err){
        throw new Error("Có lỗi xảy ra trong quá trình thực thi! Vui lòng thử lại sau!");
      }
  }


  async remove(id: number) {
    let post = await this.isExistPost(id);
    try {
      await this.postCategoryService.softDelete(post);
      return await this.postRepository.update({id}, {isDeleted: true, deletedAt: new Date()});
    }
    catch (err){
      throw new Error("Có lỗi xảy ra trong quá trình thực thi!")
    }
  }

  async isExistPost(id: number) {
    let isExistPost = await this.postRepository.findOneById(id);
    if ( !isExistPost ){
      throw new NotFoundException(`Không tìm thấy post với id là: ${id}`);
    }
    return isExistPost;
  }
}
