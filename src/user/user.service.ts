import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

import { EditUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getMe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    return {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }

  async editUser(id: string, dto: EditUserDto) {
    const user = await this.prisma.user.update({
      where: { id },
      data: { ...dto },
    });

    return {
      id: user?.id,
      email: user?.email,
      firstName: user?.firstName,
      lastName: user?.lastName,
    };
  }
}
