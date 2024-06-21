import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Category } from "../../categoies/entities/category.entity";

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  @JoinColumn({name: "postId"})
  post: Post;

  @ManyToOne(() => Category)
  @JoinColumn({name: "categoryId"})
  category: Category;
}
