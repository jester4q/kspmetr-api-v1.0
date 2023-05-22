import { Injectable, NestMiddleware } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { Logger } from './log/logger';
import { dateTimeToStr } from './utils';
import { OutgoingHttpHeaders } from 'http2';

type TResponseLog = {
    response: {
        statusCode: number;
        statusMessage: string;
        body: any;
        contentLength: number;
        headers: OutgoingHttpHeaders;
    };
};

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
    private logger = new Logger('api');

    use(request: Request, response: Response, next: NextFunction): void {
        const { ip, method, originalUrl: url, body } = request;
        const userAgent = request.get('user-agent') || '';
        const now = dateTimeToStr(new Date());

        getResponseLog(response, (log) => {
            const user = request.user;
            const reqBody = {
                userId: (user && user['userId']) || 0,
                ...(body || {}),
            };
            const resLog = log.response;
            this.logger.log(
                [
                    `${now} ${method} ${url}`,
                    `${JSON.stringify(reqBody)}`,
                    `${resLog.statusCode} ${resLog.statusMessage}`,
                    `${
                        resLog.statusCode >= 400 && resLog.statusCode < 500
                            ? JSON.stringify(resLog.body)
                            : ''
                    }`,
                    `${ip} - ${userAgent}`,
                ].join('\n'),
            );
        });

        if (next) {
            next();
        }
    }
}

export function getResponseLog(
    response: Response,
    call: (log: TResponseLog) => void,
) {
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
        const contentLength: number = parseInt(response.get('content-length'));
        responseBody = JSON.parse(body) || body || {};
        const responseLog: TResponseLog = {
            response: {
                statusCode: statusCode,
                statusMessage: statusMessage,
                body: responseBody,
                contentLength: contentLength,
                headers: response.getHeaders(),
            },
        };
        call(responseLog);
        return response;
    };
}
