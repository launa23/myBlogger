import { Body, Controller, Delete, Get, Param, Put, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { IUser } from "./user.interface";
import { User } from "../utils/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { ApiTags } from "@nestjs/swagger";
import { Roles } from "../utils/decorators/roles.decorator";
import { Role } from "../utils/app.constant";

@ApiTags('Users')
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
  @Roles(Role.USER)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    return this.usersService.update(id, updateUserDto, user);
  }

  @Put('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ResponseMessage("Cập nhật avatar")
  @Roles(Role.USER)
  updateAvatar(@User() user: IUser, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.updateAvatar(user, file.filename);
  }

  @Delete(':id')
  @Roles(Role.USER, Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
