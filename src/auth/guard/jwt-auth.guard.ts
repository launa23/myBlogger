import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from "@nestjs/core";
import { IS_PUBLIC_KEY } from "../../utils/decorators/public.decorator";

@Injectable()
//Guard nay se kiem tra token trong req
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Khi dung @Public() thi co metadata IS_PUBLIC_KEY, o day check xem IS_PUBLIC_KEY la trua hay false, neu bang true thi cho di qua ma khong can token
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    return super.canActivate(context);
  }


  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException("Token khong hop le!");
    }
    return user;
  }
}
