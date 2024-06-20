import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../utils/decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
  }

  @Public()
  @ResponseMessage("Đăng nhập User")
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@User() user: IUser) {
    return this.authService.login(user);
  }

  @Public()
  @ResponseMessage("Đăng ký User")
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }
}