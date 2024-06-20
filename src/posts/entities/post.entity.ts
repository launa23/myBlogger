import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { User } from "../../users/entities/user.entity";
import { Like } from "../../likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { Tag } from "../../tags/entities/tag.entity";
import { PostTag } from "../../posttag/entities/posttag.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  // mot post xuat hien nhieu trong postCategory
  @OneToMany(() => PostCategory, (postCategory) => postCategory.post)
  postCategories: PostCategory[];

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @OneToMany(() => PostTag, (postTag) => postTag.post)
  postTags: PostTag[];
}
