import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUrl, Max, Min } from 'class-validator';

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
    specification: { name: string; value: string }[];

    @ApiProperty({
        description: 'Product images gallerry urls',
    })
    galleryImages: { lage: string; medium: string; small: string }[];

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

export class GetProductsResponseDTO {
    items: ProductDto[];
}

export class GetCategoryProductsResponseDTO {
    items: CategoryProductDto[];
}

export class AddProductRequestDTO {
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
        description: 'Product category',
    })
    categories: { level1: number; level2: number; level3: number };
}

export class SaveProductRequestDTO {
    @ApiProperty({
        description: 'Product id',
    })
    id: number;

    @ApiProperty({
        description: 'Product code',
    })
    code: string;

    @ApiProperty({
        description: 'Product parsing id',
    })
    parsingId: number;

    @ApiProperty({
        description: 'Product title',
    })
    title: string;

    @ApiProperty({
        description: 'Product price',
    })
    unitPrice: number;
    @ApiProperty({
        description: 'Product credit mounthly price',
    })
    creditMonthlyPrice: number;

    @ApiProperty({
        description: 'Product rating',
    })
    rating: number;

    @ApiProperty({
        description: 'Product url',
    })
    url: string;

    @ApiProperty({
        description: 'Product images',
    })
    galleryImages: any;

    @ApiProperty({
        description: 'Amount product reviews',
    })
    reviewsQuantity: number;

    @ApiProperty({
        description: 'Amount product offers',
    })
    offersQuantity: number;

    @ApiProperty({
        description: 'Product specification',
    })
    specification: any;

    @ApiProperty({
        description: 'Product description',
    })
    description: string;

    @ApiProperty({
        description: 'Product sellers',
    })
    sellers: ProductSellerDTO[];

    @ApiProperty({
        description: 'Product reviews',
    })
    reviews: any;

    @ApiProperty({
        description: 'Errors of get product info',
    })
    errors: any;

    @ApiProperty({
        description: 'Product is not found',
    })
    isNotFound: boolean;
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
        description: 'Product seller credit monthly price',
    })
    creditMonthlyPrice: number;

    @ApiProperty({
        description: 'Product seller id',
    })
    id: string;

    @ApiProperty({
        description: 'Product seller url',
    })
    url: string;
}
