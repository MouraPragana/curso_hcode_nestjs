import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { UserEntity } from '../user/entity/user.entity';
import { UserModule } from '../user/user.module';
import * as dotenv from 'dotenv';

dotenv.config({
  path: process.env.ENV === 'test' ? '.env.test' : '.env',
});

@Module({
  imports: [
    FileModule,
    TypeOrmModule.forFeature([UserEntity]),
    forwardRef(() => UserModule),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
