import { ApiProperty } from '@nestjs/swagger';
import {
    ProductImageDto,
    ProductReviewDto,
    ProductSellerDTO,
    ProductSpecificationDto,
} from './product.dto';
import { IsNotEmpty, IsNumber, Validate } from 'class-validator';
import { IsNumberOrString } from './numberOrString.validator';

export class SaveProductRequestDTO {
    @ApiProperty({
        description: 'Product id',
    })
    id: number;

    @ApiProperty({
        description: 'Product code',
    })
    @IsNotEmpty()
    @Validate(IsNumberOrString)
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
    galleryImages: ProductImageDto[];

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
    specification: ProductSpecificationDto[];

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
    reviews: ProductReviewDto[];

    @ApiProperty({
        description: 'Errors of get product info',
    })
    errors: any;

    @ApiProperty({
        description: 'Product is not found',
    })
    isNotFound: boolean;
}
