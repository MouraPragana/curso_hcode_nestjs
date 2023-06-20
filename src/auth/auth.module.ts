import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    JwtModule.register({
      secret: 'segredoTeste',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
