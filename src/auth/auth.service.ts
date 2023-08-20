import { Injectable } from '@nestjs/common';

@Injectable({})
export class AuthService {
  async signUp() {
    return { message: 'You are signing UP! =D' };
  }

  async signIn() {
    return { message: 'You are signing IN! =D' };
  }
}
