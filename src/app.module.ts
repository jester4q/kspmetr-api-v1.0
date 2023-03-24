import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Category } from './category/category.entity';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { Product } from './product/product.entity';
import { ProductHistory } from './product/productHistory.entity';
import { AppLoggerMiddleware } from './appLogger.middleware';
import { AuthToken } from './auth/entities/authToken.entity';
import { ProxySettingModule } from './proxy-setting/proxy-setting.module';
import { ProxySetting } from './proxy-setting/proxy-setting.entity';
import { UserAgent } from './proxy-setting/user-agent.entity';

import dbConfig from './config/db.config';
import { ProductReview } from './product/review.entity';
import { ProductToSeller, Seller } from './product/seller.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dbConfig().default,
            entities: [
                AuthToken,
                Product,
                ProductHistory,
                ProxySetting,
                UserAgent,
                Category,
                ProductReview,
                Seller,
                ProductToSeller,
            ],
            synchronize: false,
            logger: 'file',
            logging: ['query', 'error'],
        }),
        AuthModule,
        ProxySettingModule,
        CategoryModule,
        ProductModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
