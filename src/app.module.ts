import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { AppLoggerMiddleware } from './appLogger.middleware';
import { ProxySettingModule } from './proxy-setting/proxy-setting.module';
import { UserModule } from './user/user.module';
import { entites } from './db/orm.config';

import dbConfig from './config/db.config';
import { LogModule } from './log/log.module';
import { ProductDetailsModule } from './product-details/product.details.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dbConfig(),
            entities: entites,
        }),
        AuthModule,
        UserModule,
        ProxySettingModule,
        CategoryModule,
        ProductModule,
        LogModule,
        ProductDetailsModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(AppLoggerMiddleware).forRoutes('*');
    }
}
