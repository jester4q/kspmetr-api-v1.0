import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Log } from '../common/db/entities';
import { TrackingService } from './tracking.service';

@Module({
    imports: [TypeOrmModule.forFeature([Log])],
    exports: [TrackingService],
    providers: [TrackingService],
})
export class TrackingModule {}
