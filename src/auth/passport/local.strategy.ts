import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from "../auth.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  // Ham nay se tu dong duoc goi khi login, nen ham validateUser(username, password) cung se tu dong duoc goi
  async validate(username: string, password: string): Promise<any> {
    let user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException("Token không hợp lệ!");
    }
    // Cai nay chinh la cai tra lai cho req.user
    return user;
  }
}