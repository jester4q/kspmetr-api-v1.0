import { BadRequestException, Injectable } from '@nestjs/common';

import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { CategoryService } from 'src/category/category.service';
import { ProductCategoryPathDto } from './product.dto';

@ValidatorConstraint({ name: 'CategoryPathValidation', async: true })
@Injectable()
export class CategoryPathValidation implements ValidatorConstraintInterface {
    constructor(private readonly categoryService: CategoryService) {}

    async validate(value: ProductCategoryPathDto): Promise<boolean> {
        const path = [
            value.level1,
            value.level2,
            value.level3,
            value.level4,
        ].filter((x) => x > 0);
        if (path.length < 2) {
            throw new BadRequestException('Category path is not valid');
        }
        const valid = this.categoryService.checkPath(path);

        return valid;
    }
}
