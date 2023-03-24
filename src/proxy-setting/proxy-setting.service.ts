import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'src/log/logger';
import { ProxySetting } from './proxy-setting.entity';
import { UserAgent } from './user-agent.entity';
import { TProxySetting } from './proxy-setting.types';

@Injectable()
export class ProxySettingService {
    private logger = new Logger('proxy-setting');

    constructor(
        @InjectRepository(ProxySetting)
        private proxyRepository: Repository<ProxySetting>,
        @InjectRepository(UserAgent)
        private userAgentRepository: Repository<UserAgent>,
    ) {}

    public async fetchAll(): Promise<TProxySetting[]> {
        try {
            const proxies: ProxySetting[] = await this.proxyRepository
                .createQueryBuilder()
                .select('*')
                .where({
                    status: 1,
                })
                .orderBy('RAND()')
                .execute();
            if (!proxies.length) {
                return [];
            }

            const agents: UserAgent[] = await this.userAgentRepository
                .createQueryBuilder()
                .select('*')
                .orderBy('RAND()')
                .execute();

            return proxies.map((item: ProxySetting, i: number) => {
                const agent =
                    (agents.length > 0 && agents[i % agents.length]) || null;
                return this.toProxySetting(item, agent);
            });
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async fetchOne(proxyId: number): Promise<TProxySetting> {
        try {
            const proxy = await this.proxyRepository.findOneBy({ id: proxyId });
            return this.toProxySetting(proxy, null);
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async delete(proxyId: number, reason: string): Promise<boolean> {
        try {
            const proxy = await this.proxyRepository.update(
                { id: proxyId },
                {
                    failDate: new Date(),
                    failDescription: reason,
                    status: 0,
                },
            );
        } catch (error) {
            this.logger.log(JSON.stringify(error));
        }
        return false;
    }

    protected toProxySetting(
        proxy: ProxySetting,
        agent: UserAgent | null,
    ): TProxySetting {
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
