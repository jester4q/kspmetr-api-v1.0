import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { Logger } from './log/logger';
import { dateTimeToStr } from './utils';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('api');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl: url, body } = request;
        let reqBody = body || {};

        const userAgent = request.get('user-agent') || '';
        const now = dateTimeToStr(new Date());

        const rawResponse = response.write;
        const rawResponseEnd = response.end;
        const chunkBuffers = [];
        response.write = (...chunks) => {
            const resArgs = [];
            for (let i = 0; i < chunks.length; i++) {
                resArgs[i] = chunks[i];
                if (!resArgs[i]) {
                    response.once('drain', response.write);
                    i--;
                }
            }
            if (resArgs[0]) {
                chunkBuffers.push(Buffer.from(resArgs[0]));
            }
            return rawResponse.apply(response, resArgs);
        };
        response.end = (...chunk) => {
            const resArgs = [];
            for (let i = 0; i < chunk.length; i++) {
                resArgs[i] = chunk[i];
            }
            if (resArgs[0]) {
                chunkBuffers.push(Buffer.from(resArgs[0]));
            }
            const body = Buffer.concat(chunkBuffers).toString('utf8');
            let responseBody = '{...}';
            rawResponseEnd.apply(response, resArgs);
            const { statusCode, statusMessage } = response;
            const contentLength = response.get('content-length');
            const user = request.user;
            if (user) {
                reqBody = { userId: user['id'], ...reqBody };
            }
            if (statusCode >= 400 && statusCode < 500) {
                responseBody = JSON.parse(body) || body || {};
            }
            this.logger.log(
                [
                    `${now} ${method} ${url}`,
                    `${JSON.stringify(reqBody)}`,
                    `${statusCode} ${statusMessage}`,
                    `${JSON.stringify(responseBody)}`,
                    `${ip} - ${userAgent}`,
                ].join('\n'),
            );

            return response;
        };
        /*
        response.on('close', () => {
            const { statusCode, statusMessage } = response;
            const contentLength = response.get('content-length');
            console.log(response);
            this.logger.log(
                `${now} ${method} ${url}\n${reqBody}\n${statusCode} ${statusMessage} ${contentLength} - ${userAgent} ${ip}`,
            );
        });
        */

        next();
    }
}
