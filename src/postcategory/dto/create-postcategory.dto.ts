import { IsNotEmpty, IsNumber } from "class-validator";

export class CreatePostcategoryDto {
    @IsNumber(null, {message: "ID của post phải là số"})
    @IsNotEmpty({message: "Không được để trống post id"})
    postId: number;

    @IsNumber(null, {message: "ID của category phải là số"})
    @IsNotEmpty({message: "Không được để trống category id"})
    categoryId: number;
}
