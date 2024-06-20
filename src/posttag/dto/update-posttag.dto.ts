import { PartialType } from '@nestjs/mapped-types';
import { CreatePosttagDto } from './create-posttag.dto';

export class UpdatePosttagDto extends PartialType(CreatePosttagDto) {}
