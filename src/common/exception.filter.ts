import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { Logger } from '../common/log/logger';
import { TypeORMError } from 'typeorm';
import { ApiError } from './error';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
    private logger = new Logger('exceptions');

    catch(exception: Error, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        let message = 'Internal Server Error';
        let logMessage = exception.message;
        let code = 'HttpException';
        let status = HttpStatus.INTERNAL_SERVER_ERROR;

        if (exception instanceof ApiError) {
            exception = exception.toHttpError();
        }
        if (exception instanceof HttpException) {
            status = (exception as HttpException).getStatus();
            code = (exception as HttpException).name;
            message = exception.message;
            if (exception.hasOwnProperty('response')) {
                message = (exception as any).response.message;
            }
            logMessage = message;
        } else {
            logMessage = (exception as TypeORMError).message;
            //code = (exception as any).code;
            message = 'Internal Server Error';
        }

        this.logger.log(logMessage + ' --- ' + (exception as any).stack + '---' + `${request.method} ${request.url}`);

        /*
        switch (exception.constructor) {
            case NotFoundException:
            case BadRequestException:
            case HttpException:
                status = (exception as HttpException).getStatus();
                code = (exception as HttpException).name;
                break;
            case QueryFailedError: // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as QueryFailedError).message;
                code = (exception as any).code;
                break;
            case EntityNotFoundError: // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as EntityNotFoundError).message;
                code = (exception as any).code;
                break;
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY;
                message = (exception as CannotCreateEntityIdMapError).message;
                code = (exception as any).code;
                break;
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR;
        }
        */

        response.status(status).json(GlobalResponseError(status, message, code, request));
    }
}

const GlobalResponseError: (statusCode: number, message: string, code: string, request: Request) => IResponseError = (statusCode: number, message: string, code: string, request: Request): IResponseError => {
    return {
        statusCode: statusCode,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method,
    };
};

interface IResponseError {
    statusCode: number;
    message: string;
    code: string;
    timestamp: string;
    path: string;
    method: string;
}
