import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TProxySetting } from './proxy-setting.types';
import { ProxySetting, UserAgent } from '../common/db/entities';

@Injectable()
export class ProxySettingService {
    constructor(
        @InjectRepository(ProxySetting)
        private proxyRepository: Repository<ProxySetting>,
        @InjectRepository(UserAgent)
        private userAgentRepository: Repository<UserAgent>,
    ) {}

    public async fetchAll(section: number = 0): Promise<TProxySetting[]> {
        const where: any = {
            status: 1,
        };
        if (section > 0) {
            where.section = section;
        }
        const proxies: ProxySetting[] = await this.proxyRepository.createQueryBuilder().select('*').where(where).orderBy('RAND()').execute();
        if (!proxies.length) {
            return [];
        }

        const agents: UserAgent[] = await this.userAgentRepository.createQueryBuilder().select('*').orderBy('RAND()').execute();

        return proxies.map((item: ProxySetting, i: number) => {
            const agent = (agents.length > 0 && agents[i % agents.length]) || null;
            return this.toProxySetting(item, agent);
        });
    }

    public async fetchOne(proxyId: number): Promise<TProxySetting> {
        const proxy = await this.proxyRepository.findOneBy({ id: proxyId });
        return this.toProxySetting(proxy, null);
    }

    public async delete(proxyId: number, reason: string): Promise<boolean> {
        const proxy = await this.proxyRepository.update(
            { id: proxyId },
            {
                failDate: new Date(),
                failDescription: reason,
                status: 0,
            },
        );
        return proxy.affected > 0;
    }

    protected toProxySetting(proxy: ProxySetting, agent: UserAgent | null): TProxySetting {
        return {
            id: proxy.id,
            agent: (agent && agent.value) || '',
            ip: proxy.ip,
            port: proxy.port,
            type: proxy.type,
            userName: proxy.username,
            userPwd: proxy.pwd,
        };
    }
}
