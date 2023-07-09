import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDTO } from './dto/auth-register.dto';

@Injectable()
export class AuthService {
  private issuer = 'login';
  private audience = 'users';

  constructor(
    private readonly JWTService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.JWTService.sign(
        { id: user.id, name: user.name, email: user.email },
        {
          expiresIn: '7 days',
          subject: user.id,
          issuer: this.issuer,
          audience: this.audience,
        },
      ),
    };
  }

  async checkToken(token: string) {
    try {
      return await this.JWTService.verify(token, {
        issuer: this.issuer,
        audience: this.audience,
      });
    } catch {
      throw new BadRequestException();
    }
  }

  async isValidToken(token: string) {
    try {
      await this.checkToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async login(email: string, password: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      throw new UnauthorizedException('Email e/ou senha inválidos.');
    }

    return await this.createToken(user);
  }

  async forget(email: string) {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('Email incorreto.');
    }

    const token = this.JWTService.sign(
      {
        id: user.id,
      },
      {
        expiresIn: '30 minutes',
        subject: user.id,
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailerService.sendMail({
      subject: 'Recuperação de senha',
      to: email,
      template: 'forget',
      context: {
        name: user.name,
        token,
      },
    });

    return true;
  }

  async reset(password: string, token: string) {
    try {
      const { id } = this.JWTService.verify(token, {
        issuer: 'forget',
        audience: 'users',
      });

      await this.userService.exists(id);

      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);

      await this.userRepository.update(
        { id },
        {
          password: hashPassword,
        },
      );

      const userToCreateToken = await this.userService.listOne(id);

      return this.createToken(userToCreateToken);
    } catch {
      throw new BadRequestException();
    }
  }

  async register({ birthAt, email, name, password }: AuthRegisterDTO) {
    const user = await this.userService.create({
      birthAt,
      email,
      name,
      password,
    });
    return this.createToken(user);
  }
}
