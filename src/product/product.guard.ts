import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import {
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { TSessionUser } from 'src/auth/token/authToken.service';
import { LogService } from 'src/log/log.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProductGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private logService: LogService,
        private userService: UserService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        //const user = this.reflector.get<User>('user', context.getHandler());
        const request = context.switchToHttp().getRequest();
        const {
            method,
            originalUrl: url,
            user: session,
        }: {
            method: string;
            originalUrl: string;
            user: TSessionUser;
        } = request;
        if (!session) {
            return false;
        }
        const user = await this.userService.findById(session.userId);
        if (user.banned && user.banned.getTime() >= new Date().getTime()) {
            throw new ForbiddenException('Too Many requests');
        }
        let count = await this.logService.countRequestFor10Minute(
            session.userId,
        );
        if (count > 200) {
            await this.userService.ban(user.id, 10);
            throw new ForbiddenException('Too Many requests');
        }

        count = await this.logService.countRequestForDay(session.userId);
        if (count > 10000) {
            await this.userService.ban(user.id, 24 * 60);
            throw new ForbiddenException('Too Many requests');
        }
        try {
            await this.logService.add(session, `${method} ${url}`);
        } catch (error) {
            console.log('----------', error);
        }
        return true;
    }
}
