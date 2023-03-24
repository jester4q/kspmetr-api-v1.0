import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductHistory } from './entities/productHistory.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ProductHistory])],
    controllers: [ProductController],
    providers: [ProductService],
})
export class ProductModule {}
