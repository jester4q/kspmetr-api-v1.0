import { Injectable } from '@nestjs/common';
import { registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { UserService } from './user.service';
import { User } from '../common/db/entities';

@Injectable()
@ValidatorConstraint({ name: 'IsEmailRegistered', async: true })
export class IsEmailRegisteredValidation implements ValidatorConstraintInterface {
    constructor(private readonly userService: UserService) {}

    async validate(value: string) {
        const userExist: User = await this.userService.findByEmail(value);
        return !!userExist;
    }

    defaultMessage(): string {
        return 'Email «$value» is not registered';
    }
}

export function IsEmailRegistered(options: ValidationOptions = {}) {
    return function (object: object, propertyName: 'email') {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            validator: IsEmailRegisteredValidation,
        });
    };
}
