import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthTokenStrategy } from './token/authToken.strategy';
import { AuthTokensService } from './token/authToken.service';
import { AuthToken } from './entities/authToken.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AuthToken])],
    providers: [AuthTokenStrategy, AuthTokensService],
})
export class AuthModule {}
