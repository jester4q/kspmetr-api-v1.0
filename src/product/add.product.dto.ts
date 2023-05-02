import { ApiProperty } from '@nestjs/swagger';
import { ProductCategoryPathDto } from './product.dto';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
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
    title: string;

    @ApiProperty({
        description: 'Product url',
    })
    url: string;

    @ApiProperty({
        description: 'Product category',
    })
    categories: ProductCategoryPathDto;
}
