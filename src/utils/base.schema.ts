import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export class BaseSchema {
  @Column({ default: false })
  isDeleted: boolean;

  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
