import { ApiProperty } from '@nestjs/swagger';
import { CategoryProductDto, ProductDto } from './product.dto';
import { IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetProductsResponseDto {
    items: ProductDto[];
}

export class GetCategoryProductsResponseDto {
    items: CategoryProductDto[];
}

export class GetCategoryProductsQueryDto {
    @ApiProperty({
        description: 'Reverse result',
    })
    @IsOptional()
    @Transform(({ value }) => value == '1' || value == 'true' || value === true)
    reverse: boolean;
}
