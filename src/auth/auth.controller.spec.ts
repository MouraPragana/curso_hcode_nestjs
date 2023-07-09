import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { accessToken } from '../testing/access-token.mock';
import { authForgetMockDTO } from '../testing/auth-forget-dto.mock';
import { authLoginMockDTO } from '../testing/auth-login-dto.mock';
import { AuthRegisterMockDTO } from '../testing/auth-register-dto.mock';
import { authReseMockDTO } from '../testing/auth-reset-dto.mock';
import { authServiceMock } from '../testing/auth-service.mock';
import { fileServiceMock } from '../testing/file-service.mock';
import { guardMock } from '../testing/guard.mock';
import { AuthController } from './auth.controller';
import { userEntityList } from '../testing/user-entity-list.mock';
import { getPhoto } from '../testing/get-photo.mock';

describe('AuthController', () => {
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [authServiceMock, fileServiceMock],
    })
      .overrideGuard(AuthGuard)
      .useValue(guardMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
  });

  test('Validar a definição', () => {
    expect(authController).toBeDefined();
  });

  describe('Fluxo de autenticacao', () => {
    test('method login', async () => {
      const result = await authController.login(authLoginMockDTO);
      expect(result).toEqual({ accessToken });
    });

    test('method register', async () => {
      const result = await authController.register(AuthRegisterMockDTO);
      expect(result).toEqual({ accessToken });
    });

    test('method forget', async () => {
      const result = await authController.forget(authForgetMockDTO);
      expect(result).toEqual(true);
    });

    test('method reset', async () => {
      const result = await authController.reset(authReseMockDTO);
      expect(result).toEqual({ accessToken });
    });
  });

  describe('Rotas autenticadas', () => {
    test('method me', async () => {
      const result = await authController.me(userEntityList[0]);
      expect(result).toEqual(userEntityList[0]);
    });

    test('method upload photo', async () => {
      const photo = await getPhoto();
      const result = await authController.uploadPhoto(userEntityList[0], photo);
      expect(result).toEqual({ sucess: true });
    });
  });
});
