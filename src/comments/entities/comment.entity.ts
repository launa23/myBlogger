import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Post } from "../../posts/entities/post.entity";
import { BaseSchema } from "../../utils/base.schema";

@Entity()
export class Comment extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({name: "userId"})
  user: User;

  @ManyToOne(() => Post)
  @JoinColumn({name: "postId"})
  post: Post;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({name: "parentId"})
  parent: Comment;
}
