import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TarifController } from './tarif.controller';
import { TarifService } from './tarif.service';
import { Tarif } from 'src/common/db/entities';

@Module({
    imports: [TypeOrmModule.forFeature([Tarif])],
    controllers: [TarifController],
    providers: [TarifService],
})
export class TarifModule {}
