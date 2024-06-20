import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Category } from "../../categoies/entities/category.entity";

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postCategories)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => Category, (category) => category.postCategories)
  @JoinColumn()
  category: Category;
}
