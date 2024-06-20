import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';
import mongoose, { Types } from 'mongoose';
import { Column, CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";
import { Delete } from "@nestjs/common";

export class BaseSchema {
  @DeleteDateColumn()
  deletedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
