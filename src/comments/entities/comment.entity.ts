import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn, Tree,
  TreeChildren, TreeLevelColumn,
  TreeParent
} from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Post } from "../../posts/entities/post.entity";
import { BaseSchema } from "../../utils/base.schema";
import * as child_process from "node:child_process";

@Entity()
// @Tree("materialized-path")
export class Comment extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type: 'text'})
  content: string;

  @ManyToOne(() => User, {eager: true})
  @JoinColumn({name: "userId"})
  user: User;

  @ManyToOne(() => Post, {eager: true})
  @JoinColumn({name: "postId"})
  post: Post;

  // @TreeChildren()
  // children: Comment[];
  //
  // @TreeParent()
  // parent: Comment;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({name: "parentId"})
  parent: Comment;

  // @Column()
  // mpath: string;
}
