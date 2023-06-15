import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductDetailsController } from './product.details.controller';
import { Product, ProductRequest } from '../common/db/entities/';
import { ProductDetailsService } from './product.details.service';
import { ProductHistory } from '../common/db/entities/productHistory.entity';
import { UserModule } from '../user/user.module';
import { TrackingModule } from '../tracking/tracking.module';
import { productRequestLoggerMiddleware } from './productRequestLogger.middleware';
import { ProductRequestService } from './productRequest.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Product, ProductHistory, ProductRequest]),
        UserModule,
        TrackingModule,
    ],
    controllers: [ProductDetailsController],
    providers: [ProductDetailsService, ProductRequestService],
})
export class ProductDetailsModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(productRequestLoggerMiddleware)
            .forRoutes('/api/product-details');
    }
}
