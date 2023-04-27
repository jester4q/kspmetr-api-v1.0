import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { TSessionUser } from './authToken.service';

export const SessionUser = createParamDecorator(
    (data: any, ctx: ExecutionContext): TSessionUser => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    },
);
