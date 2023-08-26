import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as argon from 'argon2';

import { PrismaService } from '../prisma/prisma.service';

import { CreateUserDto, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(createUserDto: CreateUserDto) {
    const hash = await argon.hash(createUserDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          email: createUserDto.email,
          hash,
        },
      });

      return { id: user.id, email: user.email };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }

      throw error;
    }
  }

  async signIn(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });
    if (!user) {
      throw new ForbiddenException('Wrong email or password');
    }

    const isPasswordValid = await argon.verify(user.hash, loginDto.password);
    if (!isPasswordValid) {
      throw new ForbiddenException('Wrong email or password');
    }

    return { id: user.id, email: user.email };
  }
}
