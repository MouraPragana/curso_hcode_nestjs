import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = (authorization ?? '').split(' ')[1];

    try {
      const data = await this.authService.checkToken(token);
      request.tokenPayload = data;

      return true;
    } catch {
      return false;
    }
  }
}
