import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseSchema } from "../../utils/base.schema";
import { User } from "../../users/entities/user.entity";
import { Post } from "../../posts/entities/post.entity";

@Entity()
export class Tag extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  desc: string;

  // // 1 Tag có thể nằm trong nhiểu post
  // @OneToMany(() => Post, (post) => post.tag)
  // posts: Post[];
}
