import { Body, Controller, Post, Res, UseGuards, Req, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "../utils/decorators/public.decorator";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { ResponseMessage } from "../utils/decorators/response_message.decorator";
import { Response, Request } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('Auth')
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
  login(@User() user: IUser,@Res({ passthrough: true }) response: Response) {
    return this.authService.login(user, response);
  }

  @Public()
  @ResponseMessage("Đăng ký User")
  @Post("register")
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage("Lấy refresh token")
  async handleRefreshToken(@Req() request: Request,
                           @Res({ passthrough: true }) response: Response) {
    const refreshToken = request.cookies["refresh_token"];
    return this.authService.processNewToken(refreshToken, response);
  }

  @Post("/logout")
  @ResponseMessage("Đăng xuất!")
  logout(@Res({ passthrough: true }) response: Response, @User() user: IUser){
    return this.authService.logout(user, response);
  }
}