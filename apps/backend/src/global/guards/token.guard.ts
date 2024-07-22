import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers ?? {};

    const token = authorization?.split('Bearer ')[1];
    if (!token) {
      return false;
    }

    const user = this.jwtService.decode(token) ?? {};

    const tokenIsValid = Date.now() < user.exp * 1000;
    if (tokenIsValid) {
      request.user = user;
    }
    return tokenIsValid;
  }
}
