import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailsController } from './product.details.controller';
import { Product } from '../db/entities/product.entity';
import { ProductDetailsService } from './product.details.service';
import { ProductHistory } from '../db/entities/productHistory.entity';
import { UserModule } from '../user/user.module';
import { LogModule } from 'src/log/log.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductHistory]),
        UserModule,
        LogModule,
    ],
    controllers: [ProductDetailsController],
    providers: [ProductDetailsService],
})
export class ProductDetailsModule {}
