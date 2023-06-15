import { Injectable } from '@nestjs/common';
import {
    registerDecorator,
    ValidationArguments,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { UserService } from './user.service';
import { User } from '../common/db/entities';
import { ApiContextAwareDto } from '../common/context-aware.dto';

@Injectable()
@ValidatorConstraint({ name: 'isAlreadyRegister', async: true })
export class IsAlreadyRegisterValidation
    implements ValidatorConstraintInterface
{
    constructor(private readonly userService: UserService) {}

    async validate(value: string, args: ValidationArguments) {
        const { object, property } = args;
        const dto: { email?: string; id?: number; fingerprint?: string } =
            object as unknown;
        dto.id = (object as ApiContextAwareDto).context?.id || 0;

        let userExist: User = null;

        if (property === 'email') {
            userExist = await this.userService.findByEmail(value);
        }

        if (property === 'fingerprint' && !dto.email) {
            userExist = await this.userService.findByFingerprint(value);
        }

        return !userExist || (dto.id > 0 && dto.id == userExist.id);
    }

    defaultMessage(): string {
        return '$property «$value» is already registered';
    }
}

export function IsAlreadyRegister(options: ValidationOptions = {}) {
    return function (object: object, propertyName: 'email' | 'fingerprint') {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            validator: IsAlreadyRegisterValidation,
        });
    };
}
