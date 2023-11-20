import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Tarif } from '../common/db/entities';
import { TAddTarif, TPatchTarif, TTarif } from './tarif.types';
import { NotFoundApiError } from 'src/common/error';

@Injectable()
export class TarifService {
    constructor(
        @InjectRepository(Tarif)
        private tarifRepository: Repository<Tarif>,
    ) {}

    public async fetchAll(): Promise<TTarif[]> {
        const where: any = {
            status: 1,
        };

        const tarifs: Tarif[] = await this.tarifRepository.find(where);
        if (!tarifs.length) {
            return [];
        }

        return tarifs.map((item: Tarif, i: number) => {
            return this.toTarif(item);
        });
    }

    public async fetchOne(tarifId: number): Promise<TTarif> {
        const tarif = await this.tarifRepository.findOneBy({ id: tarifId });
        if (!tarif) {
            throw new NotFoundApiError('Could not find tarif by id ' + tarifId);
        }
        return (tarif && this.toTarif(tarif)) || null;
    }

    async add(data: TAddTarif): Promise<TTarif> {
        const tarif = this.tarifRepository.create(data);
        await tarif.save();
        return this.toTarif(tarif);
    }

    async update(tarifId: number, data: TPatchTarif): Promise<TTarif> {
        const tarif = await this.tarifRepository.findOneBy({ id: tarifId });
        if (!tarif) {
            throw new NotFoundApiError('Culd not find tarif by id ' + tarifId);
        }
        if (data.name) {
            tarif.name = data.name;
        }
        if (data.role) {
            tarif.role = data.role;
        }
        if (data.price) {
            tarif.price = data.price;
        }
        if (data.months) {
            tarif.months = data.months;
        }
        await tarif.save();
        return this.toTarif(tarif);
    }

    public async delete(tarifId: number): Promise<boolean> {
        const proxy = await this.tarifRepository.update(
            { id: tarifId },
            {
                status: 0,
            },
        );
        return proxy.affected > 0;
    }

    protected toTarif(tarif: Tarif): TTarif {
        return {
            id: tarif.id,
            role: tarif.role,
            name: tarif.name,
            months: tarif.months,
            price: tarif.price,
        };
    }
}
