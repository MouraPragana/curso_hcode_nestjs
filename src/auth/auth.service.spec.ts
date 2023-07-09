import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { userRepositoryMock } from '../testing/user-repository.mock';
import { jwtServiceMock } from '../testing/jwt-service.mock';
import { userServiceMock } from '../testing/user-service.mock';
import { mailerServiceMock } from '../testing/mailer-service.mock';
import { userEntityList } from '../testing/user-entity-list.mock';
import { accessToken } from '../testing/access-token.mock';
import { jwtPayload } from '../testing/jwt-payload.mock';
import { resetToken } from '../testing/reset-token.mock';
import { AuthRegisterMockDTO } from '../testing/auth-register-dto.mock';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        userRepositoryMock,
        jwtServiceMock,
        userServiceMock,
        mailerServiceMock,
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  test('Validar a Definção', () => {
    expect(authService).toBeDefined();
  });

  describe('Token', () => {
    test('method createToken', () => {
      const result = authService.createToken(userEntityList[0]);
      expect(result).toEqual({ accessToken });
    });

    test('method checkToken', async () => {
      const result = await authService.checkToken(accessToken);
      expect(result).toEqual(jwtPayload);
    });

    test('method isValidToken', async () => {
      const result = await authService.isValidToken(accessToken);
      expect(result).toEqual(true);
    });
  });

  describe('Autenticacao', () => {
    test('method Login', async () => {
      const result = await authService.login('mateus@gmail.com', 'ouro123');
      expect(result).toEqual({ accessToken });
    });

    test('method forget', async () => {
      const result = await authService.forget('mateus@gmail.com');
      expect(result).toEqual(true);
    });

    test('method reset', async () => {
      const result = await authService.reset('senhaNova1234', resetToken);
      expect(result).toEqual({ accessToken });
    });

    test('method register', async () => {
      const result = await authService.register(AuthRegisterMockDTO);
      expect(result).toEqual({ accessToken });
    });
  });
});
