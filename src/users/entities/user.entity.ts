import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../utils/base.schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

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

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  role: string;

}
