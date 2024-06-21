import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../utils/base.schema";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Post } from "../../posts/entities/post.entity";
import { Like } from "../../likes/entities/like.entity";
import { Comment } from "../../comments/entities/comment.entity";

export const ROLE_USER = "USER";
export const ROLE_ADMIN = "ADMIN";

@Entity()
export class User extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({nullable: true})
  dob: Date;

  @Column()
  gender: string;

  @Column()
  role: string;

  // @OneToMany(() => Post, (post) => post.user)
  // posts: Post[];

  // @OneToMany(() => Like, (like) => like.user)
  // likes: Like[];
  //
  // @OneToMany(() => Comment, (comment) => comment.user)
  // comments: Comment[];
}
