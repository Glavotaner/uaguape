import { Injectable, PipeTransform } from '@nestjs/common';
import { PrismaService } from 'uaguape-db';

@Injectable()
export class UserIdPipe implements PipeTransform {
  constructor(private readonly prismaService: PrismaService) {}

  async transform(user: any) {
    const dbUser = await this.prismaService.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });
    return dbUser?.id;
  }
}
