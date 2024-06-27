import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { Post } from "../../posts/entities/post.entity";

@Entity({name: "likes"})
export class Like {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({name: "userId"})
  user: User;

  @ManyToOne(() => Post, post => post.likes)
  @JoinColumn({name: "post_id"})
  post: Post;

  //Khi xóa post hoặc xóa user thì isDeleted = true
  @Column({default: false})
  isDeleted: boolean;
}
