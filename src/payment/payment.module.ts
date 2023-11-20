import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment, Tarif } from '../common/db/entities';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from 'src/common/config/jwt.config';

@Module({
    imports: [TypeOrmModule.forFeature([Payment, Tarif]), JwtModule.registerAsync(jwtConfig)],
    controllers: [PaymentController],
    providers: [PaymentService],
})
export class PaymentModule {}
