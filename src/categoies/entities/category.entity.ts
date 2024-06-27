import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { BaseSchema } from "../../utils/base.schema";
import { Post } from "../../posts/entities/post.entity";

@Entity()
export class Category extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  name: string;

  @Column({ type: 'text' })
  desc: string;

  // @ManyToMany(() => Post, (post) => post.categories)
  // posts: Post[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.category)
  postCategories: PostCategory[];
}
