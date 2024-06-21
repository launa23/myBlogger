import { OmitType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";

export class UpdateCategoriesPostDto extends OmitType(CreatePostDto, ["content", "title", "tagId"]) {}
