import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Category } from "../../categoies/entities/category.entity";
import { Tag } from "../../tags/entities/tag.entity";

@Entity()
export class PostTag {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Post, (post) => post.postTags)
  @JoinColumn()
  post: Post;

  @ManyToOne(() => Tag, (tag) => tag.postTags)
  @JoinColumn()
  tag: Tag;
}
