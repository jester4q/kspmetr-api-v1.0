import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { ProductController } from './product.controller';
import { Product } from './product.entity';
import { ProductService } from './product.service';
import { ProductHistory } from './productHistory.entity';
import { ProductReview } from './review.entity';
import { ProductToSeller, Seller } from './seller.entity';

@Module({
    imports: [
        CategoryModule,
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
