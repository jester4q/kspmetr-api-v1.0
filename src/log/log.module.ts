import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../db/entities';
import { LogService } from './log.service';

@Module({
    imports: [TypeOrmModule.forFeature([Log])],
    exports: [LogService],
    providers: [LogService],
})
export class LogModule {}
