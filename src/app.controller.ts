import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AppService } from './app.service';
import { AuthGuard } from "@nestjs/passport";
import { LocalAuthGuard } from "./auth/guard/local-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "./auth/auth.service";
import { Public } from "./utils/decorators/public.decorator";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    ) {}

}
