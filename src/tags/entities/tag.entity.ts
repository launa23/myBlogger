import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { PostTag } from "../../posttag/entities/posttag.entity";
import { BaseSchema } from "../../utils/base.schema";

@Entity()
export class Tag extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  desc: string;

  @OneToMany(() => PostTag, (postTag) => postTag.tag)
  postTags: PostTag[];
}
