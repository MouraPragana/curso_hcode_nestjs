import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    const token = (authorization ?? '').split(' ')[1];

    try {
      const data = await this.authService.checkToken(token);
      const user = await this.userService.listOne(data.id);

      request.tokenPayload = data;
      request.user = user;

      return true;
    } catch {
      return false;
    }
  }
}
