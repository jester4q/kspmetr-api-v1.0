import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { isNumber } from 'src/utils';

@ValidatorConstraint({ name: 'IsNumberOrString', async: false })
export class IsNumberOrString implements ValidatorConstraintInterface {
    validate(val: any, args: ValidationArguments) {
        return (
            (typeof val === 'number' || typeof val === 'string') &&
            isNumber(val)
        );
    }

    defaultMessage(args: ValidationArguments) {
        return '($value) must be number or string';
    }
}
