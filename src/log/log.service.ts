//import moment from 'moment';
const moment = require('moment');
import { Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
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

    async countRequestForHour(userId: number): Promise<number> {
        return await this.logRepository.count({
            where: {
                userId: userId,
                createdAt: MoreThan(moment().add(-1, 'h').toDate()),
            },
        });
    }

    async countRequestFor10Minute(userId: number): Promise<number> {
        return await this.logRepository.count({
            where: {
                userId: userId,
                createdAt: MoreThan(moment().add(-10, 'm').toDate()),
            },
        });
    }

    async countRequestForDay(userId: number): Promise<number> {
        return await this.logRepository.count({
            where: {
                userId: userId,
                createdAt: MoreThan(moment().add(-24, 'h').toDate()),
            },
        });
    }
}
