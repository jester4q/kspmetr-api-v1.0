import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProxySettingController } from './proxy-setting.controller';
import { ProxySetting } from './proxy-setting.entity';
import { ProxySettingService } from './proxy-setting.service';
import { UserAgent } from './user-agent.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProxySetting, UserAgent])],
    controllers: [ProxySettingController],
    providers: [ProxySettingService],
})
export class ProxySettingModule {}
