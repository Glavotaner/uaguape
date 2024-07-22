import { Injectable, PipeTransform } from '@nestjs/common';
import { TokenizedUserDto } from 'uaguape-common';
import { PrismaService } from 'uaguape-db';

@Injectable()
export class UserIdPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(user: TokenizedUserDto): Promise<string> {
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });
    return dbUser?.id;
  }
}
