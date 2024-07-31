import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  TokenizedUserDto,
  UpdateUserDto,
} from '@uaguape/common';
import { UserRoutes } from '@uaguape/routes';
import { GetUser } from 'src/global/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { GetUserId } from '@global/decorators/user-id.decorator';
import { DoesNotRequireUser } from '@global/guards/user-exists.guard';

@Controller(UserRoutes.BASE)
@ApiTags(UserRoutes.BASE)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(UserRoutes.REGISTER)
  @DoesNotRequireUser()
  create(@GetUser() dto: TokenizedUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  findOne(@GetUser() user: TokenizedUserDto) {
    return user;
  }

  @Patch()
  updateUser(@GetUserId() id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }
}
