import { Injectable } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

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
}
