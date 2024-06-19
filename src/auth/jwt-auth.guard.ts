import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
//Guard nay se kiem tra token trong req
export class JwtAuthGuard extends AuthGuard('jwt') {

}
