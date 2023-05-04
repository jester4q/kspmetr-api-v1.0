import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryPathDto } from './product.dto';
import {
    IsNotEmpty,
    IsNumber,
    IsObject,
    IsString,
    Validate,
} from 'class-validator';
import { IsNumberOrString } from './numberOrString.validator';

export class AddProductRequestDTO {
    @ApiProperty({
        description: 'Product code',
        type: Number,
    })
    @IsNotEmpty()
    @Validate(IsNumberOrString)
    code: string;

    @ApiProperty({
        description: 'Product title',
    })
    @IsNotEmpty()
    @IsString()
    title: string;

    @ApiProperty({
        description: 'Product url',
    })
    @IsNotEmpty()
    @IsString()
    url: string;

    @ApiProperty({
        description: 'Product category',
    })
    @IsNotEmpty()
    @IsObject()
    categories: ProductCategoryPathDto;
}
