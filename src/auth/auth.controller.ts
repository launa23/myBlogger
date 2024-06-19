import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from "../app.service";
import { AuthService } from "./auth.service";
import { Public } from "../utils/decorators/public.decorator";
import { LocalAuthGuard } from "./local-auth.guard";
import { User } from "../utils/decorators/user.decorator";
import { IUser } from "../users/user.interface";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post("login")
  login(@User() user: IUser) {
    return this.authService.login(user);
  }
}