import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

import appConfig from '../../common/config/app.config';
import { UserRoleEnum } from '../../user/types';
import { AuthSession, User } from '../../common/db/entities';

export type TSessionUser = {
    userId: number;
    sessionId: number;
    email: string;
    fingerprint: string;
    roles: UserRoleEnum[];
};

@Injectable()
export class AuthTokensService {
    public constructor(
        @InjectRepository(AuthSession)
        private sessionRepository: Repository<AuthSession>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwt: JwtService,
    ) {}

    public async sign(user: User): Promise<string> {
        const session = await this.createSession(user.id);
        const token = this.jwt.sign(
            {
                sub: session.id,
                name: user.email || user.fingerprint,
                userId: user.id,
                roles: user.roles,
            },
            { secret: appConfig().appSecret },
        );
        session.token = token;
        await session.save();
        return token;
    }

    public async verify(token: string): Promise<TSessionUser | null> {
        const result = this.jwt.verify(token, {
            secret: appConfig().appSecret,
            ignoreExpiration: true,
        });
        if (!result.sub || !result.userId) {
            return null;
        }
        const session = await this.sessionRepository.findOne({
            where: { id: result.sub, active: true },
        });

        if (
            session &&
            session.token == token &&
            session.expiredAt.getTime() >= new Date().getTime()
        ) {
            const user = await this.userRepository.findOneBy({
                id: session.userId,
            });
            return {
                userId: session.userId,
                email: user.email,
                fingerprint: user.fingerprint,
                sessionId: session.id,
                roles: user.roles,
            };
        }
        return null;
    }

    private decode(token: string): null | { [key: string]: any } | string {
        return this.jwt.decode(token, {});
    }

    private async createSession(userId: number): Promise<AuthSession> {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        const session = this.sessionRepository.create({
            userId: userId,
            token: '',
            expiredAt: date,
            active: true,
        });
        await session.save();
        return session;
    }
}
