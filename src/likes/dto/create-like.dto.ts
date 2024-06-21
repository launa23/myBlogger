import { IsNotEmpty, IsNumber } from "class-validator";
import { Expose } from "class-transformer";

export class CreateLikeDto {
  @IsNumber({allowNaN: false}, {message: "Id của bài viết phải là số"})
  @IsNotEmpty({message: "Không được để trống id của bài viết"})
  postId: number;
}
