import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Category } from "../../categoies/entities/category.entity";

@Entity()
export class PostCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post)
  @JoinColumn({name: "post_id"})
  post: Post;

  @ManyToOne(() => Category)
  @JoinColumn({name: "category_id"})
  category: Category;

  @Column({ default: false })
  isDeleted: boolean;
}
