import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./auth/local-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth/auth.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post("/login")
  login(@Request() req){
    return this.authService.login(req.user);
  }
}
