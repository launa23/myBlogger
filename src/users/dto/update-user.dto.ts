import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from './create-user.dto';
import { Expose, Transform } from "class-transformer";
import mongoose, { Types } from "mongoose";

export class UpdateUserDto extends OmitType(CreateUserDto, ["password"] as const) {
  @Expose()
  @Transform((params) => params.obj._id)
  updatedBy: string;
}
