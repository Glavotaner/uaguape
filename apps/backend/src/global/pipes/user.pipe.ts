import { Injectable, PipeTransform } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserPipe implements PipeTransform {
  constructor(private readonly jwtService: JwtService) {}

  transform(token: string) {
    const { name, email } = this.jwtService.decode(token);
    return { name, email };
  }
}
