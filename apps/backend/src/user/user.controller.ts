import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'uaguape-common';
import { UserRoutes } from 'uaguape-routes';
import { GetUser } from 'src/global/decorators/user.decorator';

@Controller(UserRoutes.BASE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(UserRoutes.REGISTER)
  create(@GetUser() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findOne(@GetUser() user: { email: string; name: string }) {
    return user;
  }
}
