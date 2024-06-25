import { Inject, Injectable, NotFoundException, forwardRef, BadGatewayException, BadRequestException } from "@nestjs/common";
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository, Transaction, TransactionOptions, EntityManager, SelectQueryBuilder } from "typeorm";
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostcategoryService } from 'src/postcategory/postcategory.service';
import { CategoriesService } from 'src/categoies/categoies.service';
import { PostCategory } from 'src/postcategory/entities/postcategory.entity';
import { Category } from "../categoies/entities/category.entity";
import { TagsService } from "../tags/tags.service";
import { IUser } from "../users/user.interface";
import { UsersService } from "../users/users.service";
import { UpdateCategoriesPostDto } from "./dto/update-categories-post";
import { groupedCategory } from "../utils/transform";

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    // @InjectRepository(Like)
    // private readonly likeRepository: LikeRepository,
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

      const post = await this.postRepository.save({...createPostDto, user, tag});
    try {
      categories.forEach(async category => {
        let postCategoryService1 = new PostCategory();
        postCategoryService1.category = category;
        postCategoryService1.post = post;
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

  async findAll(currentPage?: number, limit?: number, ){
    const qbd = this.queryBuilder();
    const arr = await qbd
      .skip((currentPage - 1) * limit)
      .take(limit)
      .getRawMany();
    return groupedCategory(arr);
  }

  async getOneById(id: number){
    const qbd = this.queryBuilder().andWhere("post.id = :id", {id});
    return groupedCategory(await qbd.getRawMany());
  }

  async findByCategory(cateName: string){
    const arr = await this.findAll();
    return arr.filter(post => post.cate_name.includes(cateName));
  }

  async findByTag(tagName: string){
    const qbd = this.queryBuilder();
    qbd.andWhere("tag.label = :tagName", {tagName});
    return groupedCategory(await qbd.getRawMany());
  }


  async findOne(id: number) {
    const post = await this.postRepository.findOneById(id);
    if ( !post ){
      throw new NotFoundException(`Không tìm thấy post với id là: ${id}`);
    }
    return post;
  }

  async updateContent(id: number, updatePostDto: UpdatePostDto, user: IUser) {
    const post = await this.isExistPost(id);
    const tag = await this.tagsService.isExistTag(updatePostDto.tagId);
    if ( !tag ){
      throw new NotFoundException(`Không tìm thấy tag với id là: ${id}`);
    }
    const postNew = new Post();
    postNew.tag = tag;
    postNew.title = updatePostDto.title;
    postNew.content = updatePostDto.content;
    return await this.postRepository.update({id}, postNew);
  }

  async updateCategories(id: number, updateDto: UpdateCategoriesPostDto){
      const post = await this.isExistPost(id);

      const categories = await this.categoryService.findByIds(updateDto.categories);
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

  queryBuilder(){
    return this.postRepository.createQueryBuilder('post')
      .leftJoinAndSelect( 'post.likes', 'like')
      .leftJoinAndSelect( 'post.comments', 'cmt')
      .leftJoinAndSelect( 'post.tag', 'tag')
      .leftJoinAndSelect( 'post.postCategories', 'pc')
      .leftJoinAndSelect( 'post.user', 'user')
      .leftJoinAndSelect( 'pc.category', 'cate')
      .where("post.isDeleted = false")
      .select([
        'post.id',
        'post.title',
        'post.userId',
        'tag.label',
        'cate.name',
        'user.name',
        'post.createdAt',
        'COUNT(DISTINCT like.id) AS totalLikes',
        'COUNT(DISTINCT cmt.id) AS totalComments',
      ])
      .groupBy('post.id, post.title, post.userId, tag.label, cate.name, user.name, post.createdAt');
  }
}
