import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AuthRegisterMockDTO } from '../src/testing/auth-register-dto.mock';
import { authLoginMockDTO } from '../src/testing/auth-login-dto.mock';
import { Role } from '../src/enums/role.enum';
import { AppDataSource } from '../src/data/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('Registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(AuthRegisterMockDTO);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
    accessToken = response.body.accessToken;
  });

  it('Tentar fazer login com novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(authLoginMockDTO);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
    accessToken = response.body.accessToken;
  });

  it('Obter os dados do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body.id).toEqual('string');
    expect(response.body.role).toEqual(Role.User);
  });

  it('Registrar um novo usuário como administrador', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...AuthRegisterMockDTO,
        role: Role.Admin,
        email: 'henrique@hcode.com.br',
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
    accessToken = response.body.accessToken;
  });

  it('Validar se a função do novo usuário ainda é user', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body.id).toEqual('string');
    expect(response.body.role).toEqual(Role.User);
    userId = response.body.id;
  });

  it('Tentar ver a lista de todos os usuários', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${accessToken}`);

    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('Alterando manualmente o usuário para a função administrador', async () => {
    const connection = await AppDataSource.initialize();
    const queryRunner = connection.createQueryRunner();
    await queryRunner.query(
      `UPDATE users set role = '${Role.Admin}' WHERE id='${userId}' `,
    );

    const rows = await queryRunner.query(
      `SELECT * FROM users WHERE id='${userId}'`,
    );

    AppDataSource.destroy();

    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(Role.Admin);
  });

  it('Tentar ver a lista de todos os usuários, agora com acesso', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `bearer ${accessToken}`);

    expect(response.statusCode).toEqual(200);
    expect(response.body.length).toEqual(2);
  });
});
