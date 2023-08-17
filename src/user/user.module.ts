import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { EmailVerification, User } from '../common/db/entities';
import { UserRequestGuard } from './user.request.guard';
import { TrackingModule } from '../tracking/tracking.module';
import { IsAlreadyRegisterValidation } from './isAlreadyRegister.validation';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';
import { IsEmailRegisteredValidation } from './isEmailRegistered.validation';

@Module({
    imports: [TypeOrmModule.forFeature([User, EmailVerification]), TrackingModule, JwtModule.registerAsync(jwtConfig)],
    controllers: [UserController],
    exports: [UserService, UserRequestGuard],
    providers: [UserService, UserRequestGuard, IsAlreadyRegisterValidation, IsEmailRegisteredValidation],
})
export class UserModule {}
