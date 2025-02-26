import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenizedUserDto } from '@uaguape/common';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers ?? {};

    const token = authorization?.split('Bearer ')[1];
    if (!token) {
      return false;
    }

    const user: TokenizedUserDto & { exp: number } =
      this.jwtService.decode(token);

    const isValidJwt = Object.keys(user).length > 0;

    if (isValidJwt) {
      const tokenIsValid = Date.now() < user.exp * 1000;
      if (tokenIsValid) {
        request.user = user;
      }
      return tokenIsValid;
    }
    return false;
  }
}
