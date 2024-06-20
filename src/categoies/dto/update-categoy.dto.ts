import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoyDto } from './create-categoy.dto';

export class UpdateCategoyDto extends PartialType(CreateCategoyDto) {}
