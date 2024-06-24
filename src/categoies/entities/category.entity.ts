import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";
import { BaseSchema } from "../../utils/base.schema";

@Entity()
export class Category extends BaseSchema{
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 300 })
  name: string;

  @Column({ type: 'text' })
  desc: string;

  // Thuoc tinh nay se khong duoc hien thi tren DB
  @OneToMany(() => PostCategory, (postCategory) => postCategory.category)
  postCategories: PostCategory[];
}
