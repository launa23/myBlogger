import { IsNumber, IsString } from "class-validator";

export class CreateCommentDto {
  @IsString({message: "Nội dung bình luận phải là text"})
  content: string;

  @IsNumber({allowNaN: false}, {message: "PostId phải là số"})
  postId: number;

  // @IsNumber({allowNaN: true}, {message: "ParentId phải là số"})
  parentId?: number;
}
