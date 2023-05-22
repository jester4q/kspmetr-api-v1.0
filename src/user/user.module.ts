import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from '../db/entities';
import { UserRequestGuard } from './user.request.guard';
import { LogModule } from '../log/log.module';
import { IsAlreadyRegisterValidation } from './isAlreadyRegister.validation';

@Module({
    imports: [TypeOrmModule.forFeature([User]), LogModule],
    controllers: [UserController],
    exports: [UserService, UserRequestGuard],
    providers: [UserService, UserRequestGuard, IsAlreadyRegisterValidation],
})
export class UserModule {}
