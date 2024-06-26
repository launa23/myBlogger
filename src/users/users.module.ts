import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from "./entities/user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MulterModule } from "@nestjs/platform-express";
import { MulterConfigService } from "../utils/config/multer.config";

@Module({
  imports: [TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({
      useClass: MulterConfigService
    }),],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
