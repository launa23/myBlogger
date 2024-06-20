import { PartialType } from '@nestjs/mapped-types';
import { CreatePostcategoryDto } from './create-postcategory.dto';

export class UpdatePostcategoryDto extends PartialType(CreatePostcategoryDto) {}
