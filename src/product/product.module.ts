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
import { UserModule } from '../user/user.module';
import { LogModule } from 'src/log/log.module';
import { ProductListController } from './product.list.controller';

@Module({
    imports: [
        CategoryModule,
        UserModule,
        LogModule,
        TypeOrmModule.forFeature([
            Product,
            ProductHistory,
            Seller,
            ProductToSeller,
            ProductReview,
        ]),
    ],
    controllers: [ProductController, ProductListController],
    providers: [ProductService],
})
export class ProductModule {}
