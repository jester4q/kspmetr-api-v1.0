import {
    BadRequestException,
    Injectable,
    UnprocessableEntityException,
} from '@nestjs/common';

import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from 'src/category/category.service';
import { ProductCategoryPathDto, ProductImageDto } from './product.dto';
import { ECDH } from 'crypto';

@ValidatorConstraint({ name: 'ProductUrlValidation', async: false })
@Injectable()
export class ProductUrlValidation implements ValidatorConstraintInterface {
    constructor() {}

    validate(value: string): boolean {
        if (!value) {
            return false;
        }
        const valid = this.checkUrl(value);
        return valid;
    }

    defaultMessage(validationArguments?: ValidationArguments): string {
        return 'Product url is not valid';
    }

    private checkUrl(str: any): boolean {
        let url;
        try {
            url = new URL(str);
        } catch (err) {
            return false;
        }
        if (url.host.indexOf('kaspi.kz') == -1) {
            return false;
        }
        if (url.pathname.indexOf('shop/') === -1) {
            return false;
        }
        return true;
    }
}
