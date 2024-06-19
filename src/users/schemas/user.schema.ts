import { SchemaFactory, Schema, Prop } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";
import { BaseSchema } from "../../utils/base.schema";

export type UserDocument = HydratedDocument<User>;

export const ROLE_USER = "USER";
export const ROLE_ADMIN = "ADMIN";

@Schema({ timestamps: true })
export class User extends BaseSchema{
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  age: number;

  @Prop()
  gender: string;

  @Prop()
  role: string;

}
export const UserSchema = SchemaFactory.createForClass(User);
