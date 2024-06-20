import { Column } from "typeorm";
import { IsDate, IsNotEmpty, IsString } from "class-validator";

export class CreateCategoryDto {
  @IsString({message: "Tên của danh mục phải là chuỗi"})
  @IsNotEmpty({message: "Không được để trống tên danh mục"})
  name: string;

  @IsString({message: "Mô tả của danh mục phải là chuỗi"})
  @IsNotEmpty({message: "Không được để trống mô tả"})
  desc: string;

}
