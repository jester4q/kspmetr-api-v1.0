import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenStrategy } from './token/authToken.strategy';
import { AuthTokensService } from './token/authToken.service';
import { UserModule } from '../user/user.module';
import { jwtConfig } from '../config/jwt.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthSession, User } from '../db/entities';

@Module({
    imports: [
        UserModule,
        TypeOrmModule.forFeature([AuthSession, User]),
        JwtModule.registerAsync(jwtConfig),
    ],
    controllers: [AuthController],
    providers: [AuthService, AuthTokenStrategy, AuthTokensService],
})
export class AuthModule {}
