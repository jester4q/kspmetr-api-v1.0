import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

/**
 * Injects request data into the context, so that the ValidationPipe can use it.
 */
@Injectable()
export class ApiContextInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();

        request.body.context = {
            id: request.params.id,
            parentId: request.params.parentId,
        };

        return next.handle();
    }
}
