import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { TSessionUser } from 'src/auth/token/authToken.service';
import { User } from '../common/db/entities';
import { TrackingService } from '../tracking/tracking.service';
import { UserService } from 'src/user/user.service';

import limitsConfig from '../common/config/limits.config';

const POST_PRODUCT_QUERY = 'POST /api/products/detailed';
const GET_PRODUCT_DETAILS_QUERY = 'GET /api/product-details';

@Injectable()
export class UserRequestGuard implements CanActivate {
    constructor(private reflector: Reflector, private logService: TrackingService, private userService: UserService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
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
        const query = `${method.toUpperCase()} ${url.toLowerCase()}`;
        if (query.indexOf(GET_PRODUCT_DETAILS_QUERY) === 0) {
            await this.checkGetProductDetails(user);
        }
        if (query.indexOf(POST_PRODUCT_QUERY) === 0) {
            await this.checkPostProduct(user);
        }
        try {
            await this.logService.add(session, query);
        } catch (error) {
            console.log('----------', error);
        }
        return true;
    }

    private async checkPostProduct(user: User) {
        const query = POST_PRODUCT_QUERY;
        if (user.banned && user.banned.getTime() >= new Date().getTime()) {
            throw new ForbiddenException('Too Many requests');
        }
        let count = await this.logService.countRequestForMinute(user.id, query, 10);
        if (count > 200) {
            await this.userService.ban(user.id, 10);
            throw new ForbiddenException('Too Many requests');
        }

        count = await this.logService.countRequestForDay(user.id, query, 1);
        if (count > 10000) {
            await this.userService.ban(user.id, 24 * 60);
            throw new ForbiddenException('Too Many requests');
        }
    }

    private async checkGetProductDetails(user: User) {
        const query = GET_PRODUCT_DETAILS_QUERY;
        let count = await this.logService.countRequestForMinute(user.id, query, 1);
        /*
        if (count > 10) {
            throw new ForbiddenException('Too Many requests for last minute');
        }
        count = await this.logService.countRequestForHour(user.id, query, 1);
        if (count > 200) {
            throw new ForbiddenException('Too Many requests for last hour');
        }
        */
        const limits = limitsConfig();
        if (limits.requestsPerDay >= 0) {
            count = await this.logService.countRequestForDay(user.id, query, 1);
            if (count > limits.requestsPerDay) {
                throw new ForbiddenException('Too Many requests for last 24 hours');
            }
        }
    }
}
