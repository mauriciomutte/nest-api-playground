import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { CreateUserDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Auth', () => {
    const userDto: CreateUserDto = {
      email: 'calopsita@gmail.com',
      password: '123',
    };

    it('/auth/signup (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/signup')
        .send(userDto)
        .expect(201);
    });

    it('/auth/signin (POST)', async () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .send(userDto)
        .expect(200)
        .then((response) => {
          token = response.body.access_token;
          return response;
        });
    });
  });

  describe('User', () => {
    it('/user/me (GET)', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
    });

    it('/user (PATCH)', () => {
      return request(app.getHttpServer())
        .patch('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Calopsita' })
        .expect(200);
    });
  });
});
