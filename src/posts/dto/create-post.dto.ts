import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePostDto {
    @IsString({message: "Tiêu để của bài viết phải là chuỗi"})
    @IsNotEmpty({message: "Không được để trống tiêu đề bài viết"})
    title: string;
  
    @IsString({message: "Nội dung của bài viết phải là text"})
    @IsNotEmpty({message: "Không được để trống nội dung bài viết"})
    content: string;

    @IsArray({message: "Danh sách danh mục phải là 1 mảng"})
    @IsNotEmpty({message: "Không được để trống danh mục "})
    @IsNumber(null, {each: true, message: "Các phần tử trong danh sách phải là id của danh mục"})
    categories: number[];

    @IsArray({message: "Danh sách tag phải là 1 mảng"})
    @IsNotEmpty({message: "Không được để trống tags"})
    @IsNumber(null, {each: true, message: "Các phần tử trong danh sách phải là id của tag"})
    tags: number[]
}
