import { AuthResetDTO } from '../auth/dto/auth-reset.dto';
import { resetToken } from './reset-token.mock';

export const authReseMockDTO: AuthResetDTO = {
  password: 'ouro123',
  token: resetToken,
};
