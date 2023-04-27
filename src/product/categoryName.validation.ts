import { BadRequestException, Injectable } from '@nestjs/common';

import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ProductCategoryNameDto } from './product.dto';

@ValidatorConstraint({ name: 'CategoryNameValidation', async: false })
@Injectable()
export class CategoryNameValidation implements ValidatorConstraintInterface {
    constructor() {}

    async validate(value: ProductCategoryNameDto): Promise<boolean> {
        if (!value) {
            return false;
        }

        if (!value.level1 || !value.level2) {
            return false;
        }

        if (value.level4 && !value.level3) {
            return false;
        }

        const path = [
            value.level1,
            value.level2,
            value.level3,
            value.level4,
        ].filter((x) => x && x.length);
        if (path.length < 2) {
            return false;
        }
        return true;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Category name path is not valid';
    }
}
