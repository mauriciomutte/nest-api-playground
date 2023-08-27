import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthGuard } from '../common/guards';
import { GetUser } from '../common/decorators';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@GetUser() user: User) {
    return this.userService.getMe(user.id);
  }
}
