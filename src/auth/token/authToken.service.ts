import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthToken } from '../entities/authToken.entity';

export type TAuth = {
    id: number;
    name: string;
};

@Injectable()
export class AuthTokensService {
    public constructor(
        @InjectRepository(AuthToken)
        private authTokenRepository: Repository<AuthToken>,
    ) {}

    public async verify(token: string): Promise<TAuth | null> {
        if (!token) {
            throw new Error('Access token is not defined');
        }
        try {
            const auth = await this.authTokenRepository.findOne({
                where: { token: token, active: true },
            });
            if (auth) {
                auth.lastAcessDate = new Date();
                auth.save();
                return {
                    id: auth.id,
                    name: auth.name,
                };
            }
        } catch ($error) {
            console.log($error);
        }

        return null;
    }
}
