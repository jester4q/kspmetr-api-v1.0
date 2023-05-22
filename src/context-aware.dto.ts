import { Allow } from 'class-validator';

export class ContextAwareDto {
    @Allow()
    context?: {
        id?: number;
        parentId?: number;
    };
}
