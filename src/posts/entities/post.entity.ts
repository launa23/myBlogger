import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { User } from "../../users/entities/user.entity";
import { Like } from "../../likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";
import { PostTag } from "../../posttag/entities/posttag.entity";
import { BaseSchema } from "src/utils/base.schema";
import { Tag } from "../../tags/entities/tag.entity";

@Entity()
export class Post extends BaseSchema {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  content: string;

  // // mot post xuat hien nhieu trong postCategory
  // @OneToMany(() => PostCategory, (postCategory) => postCategory.post)
  // postCategories: PostCategory[];

  // Một post có 1 tag
  @ManyToOne(() => Tag)
  @JoinColumn({ name: "tagId" })
  tag: Tag;

  @ManyToOne(() => User)
  @JoinColumn({ name: "userId" })
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];


}
