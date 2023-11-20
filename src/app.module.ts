import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { LoggerMiddleware } from './common/log/logger.middleware';
import { ProxySettingModule } from './proxy-setting/proxy-setting.module';
import { UserModule } from './user/user.module';
import { entites } from './common/db/orm.config';
import { TrackingModule } from './tracking/tracking.module';
import { ProductDetailsModule } from './product-details/product.details.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import dbConfig from './common/config/db.config';
import { TarifModule } from './tarif/tarif.module';
import { PaymentModule } from './payment/payment.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...dbConfig(),
            entities: entites,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        UserModule,
        ProxySettingModule,
        CategoryModule,
        ProductModule,
        TrackingModule,
        ProductDetailsModule,
        TarifModule,
        PaymentModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggerMiddleware).forRoutes('*');
    }
}
