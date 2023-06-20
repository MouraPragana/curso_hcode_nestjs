import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly JWTService: JwtService,
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async createToken(user: User) {
    return {
      accessToken: this.JWTService.sign({
        expiresIn: '7 days',
        subject: user.id,
        issuer: 'login',
        audience: 'users',
      }),
    };
  }
  async checkToken(token: string) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
        password,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    return await this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email está incorreto.');
    }

    return true;
  }

  async reset(password: string, token: string) {
    const id = 'f8cf3693-5233-4f7a-b731-993e686270e3';

    const user = await this.prisma.user.update({
      where: { id },
      data: {
        password,
      },
    });

    return await this.createToken(user);
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);

    return await this.createToken(user);
  }
}
