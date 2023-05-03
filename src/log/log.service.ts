//import moment from 'moment';
const moment = require('moment');
import { Injectable } from '@nestjs/common';
import { Like, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Log } from '../db/entities';
import { TSessionUser } from 'src/auth/token/authToken.service';

@Injectable()
export class LogService {
    constructor(
        @InjectRepository(Log)
        private logRepository: Repository<Log>,
    ) {}

    async add(user: TSessionUser, query: string): Promise<Log> {
        const newLog = this.logRepository.create({
            userId: user.userId,
            sessionId: user.sessionId,
            query: query,
        });
        newLog.save();
        return newLog;
    }

    async countRequestForHour(
        userId: number,
        query: string,
        h: number,
    ): Promise<number> {
        return await this.countRequest(userId, query, 'h', h);
    }

    async countRequestForMinute(
        userId: number,
        query: string,
        min: number,
    ): Promise<number> {
        return await this.countRequest(userId, query, 'm', min);
    }

    async countRequestForDay(
        userId: number,
        query: string,
        d: number,
    ): Promise<number> {
        return await this.countRequest(userId, query, 'd', d);
    }

    private async countRequest(
        userId: number,
        query: string,
        t: string,
        n: number,
    ): Promise<number> {
        return await this.logRepository.count({
            where: {
                userId: userId,
                query: Like(query + '%'),
                createdAt: MoreThan(
                    moment()
                        .add(-1 * n, t)
                        .toDate(),
                ),
            },
        });
    }
}
