import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import { Types } from 'mongoose';

export class BaseSchema {
  @Expose()
  @Transform((params) => params.obj._id.toString())
  createdBy: Types.ObjectId;

  @Expose()
  @Transform((params) => params.obj._id.toString())
  updatedBy: Types.ObjectId;

  @Expose()
  @Transform((params) => params.obj._id.toString())
  deletedBy: Types.ObjectId;

  @Prop({ default: null, required: false })
  deletedAt: Date;

  @Prop({ default: new Date(), required: false })
  createdAt: Date;

  @Prop({ default: new Date(), required: false })
  updatedAt: Date;
}
