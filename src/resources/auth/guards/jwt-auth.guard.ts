import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { SKIP_JWT_AUTH } from '../../../common/decorators/skip-jwtauth/skip-jwtauth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const skipJwtAuth = this.reflector.getAllAndOverride<boolean>(
      SKIP_JWT_AUTH,
      [context.getHandler(), context.getClass()],
    );
    if (skipJwtAuth) {
      return true;
    }
    return super.canActivate(context);
  }
}
