import { ApiProperty } from '@nestjs/swagger';
import { TCategoryPath } from './product.types';

export class ProductDto {
    @ApiProperty({
        description: 'Product id',
    })
    id: number;

    @ApiProperty({
        description: 'Product code',
    })
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
        description: 'Product init price',
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Product credit monthly price',
    })
    creditMonthlyPrice: number;

    @ApiProperty({
        description: 'Amount of sellers',
    })
    offersQuantity: number;

    @ApiProperty({
        description: 'Amount of reviews',
    })
    reviewsQuantity: number;

    @ApiProperty({
        description: 'Product description',
    })
    description: string;

    @ApiProperty({
        description: 'Product specification',
    })
    specification: ProductSpecificationDto[];

    @ApiProperty({
        description: 'Product images gallerry urls',
    })
    galleryImages: ProductImageDto[];

    @ApiProperty({
        description: 'Product last check date',
    })
    lastCheckedAt: Date;

    @ApiProperty({
        description: 'Product rating',
    })
    productRating: number;
}

export class CategoryProductDto {
    @ApiProperty({
        description: 'Product id',
    })
    id: number;

    @ApiProperty({
        description: 'Pmhroduct code',
    })
    code: string;

    @ApiProperty({
        description: 'Product title',
    })
    title: string;

    @ApiProperty({
        description: 'Product url',
    })
    url: string;
}

export class ProductSpecificationDto {
    @ApiProperty({
        description: 'Field name',
    })
    name: string;
    @ApiProperty({
        description: 'Field value',
    })
    value: string;
}

export class ProductImageDto {
    @ApiProperty({
        description: 'Lage image url',
    })
    large: string;

    @ApiProperty({
        description: 'Medium image url',
    })
    medium: string;

    @ApiProperty({
        description: 'Small image url',
    })
    small: string;
}

export class ProductReviewDto {
    @ApiProperty({
        description: 'Reviw author name',
    })
    author: string;
    @ApiProperty({
        description: 'Review date',
    })
    date: string;
    @ApiProperty({
        description: 'Product rating',
    })
    rating: number;
    @ApiProperty({
        description: 'External review id',
    })
    id: string;
}

export class ProductCategoryPathDto {
    @ApiProperty({
        description: 'Level 1 category id',
        required: true,
    })
    level1: number;
    @ApiProperty({
        description: 'Level 2 category id',
        required: true,
    })
    level2: number;
    @ApiProperty({
        description: 'Level 3 category id',
        required: false,
    })
    level3?: number;
    @ApiProperty({
        description: 'Level 4 category id',
        required: false,
    })
    level4?: number;
}

export class ProductCategoryNameDto {
    @ApiProperty({
        description: 'Level 1 category name',
        required: true,
    })
    level1: string;
    @ApiProperty({
        description: 'Level 2 category name',
        required: true,
    })
    level2: string;
    @ApiProperty({
        description: 'Level 3 category name',
        required: false,
    })
    level3?: string;
    @ApiProperty({
        description: 'Level 4 category name',
        required: false,
    })
    level4?: string;
}

export class ProductSellerDTO {
    @ApiProperty({
        description: 'Product seller name',
    })
    name: string;

    @ApiProperty({
        description: 'Product seller price',
    })
    price: number;

    @ApiProperty({
        description: 'Product seller merchantId',
    })
    merchantId: string;

    @ApiProperty({
        description: 'Product seller url',
    })
    url: string;
}
