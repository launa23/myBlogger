import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { User } from "../../users/entities/user.entity";
import { Like } from "../../likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { BaseSchema } from "src/utils/base.schema";
import { Tag } from "../../tags/entities/tag.entity";
import { Category } from "../../categoies/entities/category.entity";

@Entity()
export class Post extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'text', nullable: true })
  thumbnail: string;

  // Một post có 1 tag
  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tagId" })
  tag: Tag;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  // @ManyToMany(() => Category, (category) => category.posts)
  // @JoinTable( )
  // categories: Category[];

  @OneToMany(() => PostCategory, (postCategory) => postCategory.category)
  postCategories: PostCategory[];

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];
}
