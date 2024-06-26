import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UploadedFile, UseInterceptors } from "@nestjs/common";
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from "./user.interface";
import { User } from "../utils/decorators/user.decorator";
import { Public } from "../utils/decorators/public.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put('update/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ResponseMessage("Cập nhật avatar")
  updateAvatar(@User() user: IUser, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(user, file.filename);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
