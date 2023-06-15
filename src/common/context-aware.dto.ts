import { Allow } from 'class-validator';

export class ApiContextAwareDto {
    @Allow()
    context?: {
        id?: number;
        parentId?: number;
    };
}
