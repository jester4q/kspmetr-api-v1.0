import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxySettingController } from './proxy-setting.controller';
import { ProxySettingService } from './proxy-setting.service';
import { ProxySetting, UserAgent } from '../db/entities';

@Module({
    imports: [TypeOrmModule.forFeature([ProxySetting, UserAgent])],
    controllers: [ProxySettingController],
    providers: [ProxySettingService],
})
export class ProxySettingModule {}
