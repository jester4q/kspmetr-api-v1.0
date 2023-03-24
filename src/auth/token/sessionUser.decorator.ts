import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TAuth } from './authToken.service';

export const SessionUser = createParamDecorator(
    (data: any, ctx: ExecutionContext): TAuth => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
