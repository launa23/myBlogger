import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PostCategory } from "../../postcategory/entities/postcategory.entity";

@Entity()
export class Category {
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
