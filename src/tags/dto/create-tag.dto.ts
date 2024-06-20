import { IsNotEmpty, IsString } from "class-validator";

export class CreateTagDto {
  @IsString({message: "Tên của tag phải là chuỗi"})
  @IsNotEmpty({message: "Không được để trống tên tag"})
  label: string;

  @IsString({message: "Mô tả của tag phải là chuỗi"})
  @IsNotEmpty({message: "Không được để trống mô tả"})
  desc: string;

}
