import { Body, Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../utils/decorators/public.decorator";
import { LocalAuthGuard } from "./local-auth.guard";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@User() user: IUser) {
    return this.authService.login(user);
  }

  @Public()
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}