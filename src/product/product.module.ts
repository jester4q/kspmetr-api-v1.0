import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import {
    Product,
    ProductHistory,
    Seller,
    ProductToSeller,
    ProductReview,
} from '../db/entities';
import { LogModule } from 'src/log/log.module';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
        CategoryModule,
        LogModule,
        UserModule,
        TypeOrmModule.forFeature([
            Product,
            ProductHistory,
            Seller,
            ProductToSeller,
            ProductReview,
        ]),
    ],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
