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
    private readonly postCategoryService: PostcategoryService,
    private readonly categoryService: CategoriesService,
    private readonly tagsService: TagsService,
    private readonly usersService: UsersService,
  ) { }

  async create(createPostDto: CreatePostDto, userId: number, filename: string) {
    const user = await this.usersService.findOne(userId);
    const tag = await this.tagsService.isExistTag(createPostDto.tagId);
    const categories: Category[] = [];
    for (const categoryID of createPostDto.categories) {
      const isExistCategory = await this.categoryService.isExistCategory(categoryID);
      if ( !isExistCategory ) {
        throw new BadRequestException(`Không tìm thấy category với id: ${categoryID}`)
      }
      categories.push(isExistCategory);
    }

    const post = await this.postRepository.save({...createPostDto, user, tag, thumbnail: filename});
    try {
      categories.forEach(async category => {
        const postCategory = new PostCategory();
        postCategory.category = category;
        postCategory.post = post;
        await this.postCategoryService.create(postCategory);
      })
      return {
        title: createPostDto.title,
        content: createPostDto.content,
        categories: categories.map(category => category.name),
        thumbnail: filename,
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
      .orderBy('post.createdAt', 'DESC')
      .limit(limit)
      .offset( limit * currentPage - limit )
      .getRawMany();
    const total = await this.postRepository
      .createQueryBuilder("post")
      .where('post.isDeleted is false')
      .getCount();
    return {
      total_post: total,
      total_page: Math.ceil(total / limit),
      current_page: currentPage,
      limit: limit,
      data: arr
    };
  }

  async getOneById(id: number){
    const qbd = this.queryBuilder().andWhere("post.id = :id", {id});
    return groupedCategory(await qbd.getRawMany());
  }

  async findByCategory(cateName: string){
    const arr = await this.queryBuilder().getRawMany();
    return arr.filter(post => post.cate_name?.some(name => name.toLowerCase().includes(cateName.toLowerCase())));
  }

  async findByTag(tagName: string){
    const qbd = this.queryBuilder();
    qbd.andWhere("tag.label = :tagName", {tagName});
    return await qbd.getRawMany();
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
    const post = await this.isExistPost(id);
    try {
      await this.postCategoryService.softDelete(post);
      return await this.postRepository.update({id}, {isDeleted: true, deletedAt: new Date()});
    }
    catch (err){
      throw new Error("Có lỗi xảy ra trong quá trình thực thi!")
    }
  }

  async isExistPost(id: number) {
    const isExistPost = await this.postRepository.findOneById(id);
    if ( !isExistPost ){
      throw new NotFoundException(`Không tìm thấy post với id là: ${id}`);
    }
    return isExistPost;
  }

  queryBuilder(){
    return this.postRepository.createQueryBuilder('post')
      .select([
        "post.id AS post_id",
        "tag.label AS tag",
        "post.title AS post_title",
        "post.content AS post_content",
        "post.createdAt AS created_at",
        "user.id AS user_id",
        "user.avatar AS user_avatar",
        "post.thumbnail AS post_thumbnail",
        "user.name AS user_name",
        "(SELECT COUNT(*) FROM likes WHERE likes.post_id = post.id) AS total_likes",
        "(SELECT COUNT(*) FROM comment WHERE comment.post_id = post.id) AS total_comments",
        "(SELECT array_agg(category.name) FROM post_category pc JOIN category ON pc.category_id = category.id WHERE pc.post_id = post.id) AS cate_name"
      ])
      .leftJoin("post.user", "user")
      .leftJoin("post.tag", "tag")
      .leftJoin("post.postCategories", "post_category")
      .leftJoin("post_category.category", "category")
      .where('post.isDeleted is false')
      .groupBy("post.id, user.id, tag.label");
  }
}
