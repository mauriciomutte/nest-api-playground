import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { User } from '@prisma/client';

import { AuthGuard } from '../common/guards';
import { GetUser } from '../common/decorators';

import { UserService } from './user.service';
import { EditUserDto } from './dto';

@UseGuards(AuthGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@GetUser() user: User) {
    return this.userService.getMe(user.id);
  }

  @Patch()
  async editUser(@GetUser('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}
