import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsUrl, Max, Min } from 'class-validator';

export class ProductInfoQueryDto {
    @IsUrl()
    q: string;

    @IsInt()
    @Max(356)
    @Min(1)
    period: number;

    @IsNotEmpty()
    data_type: string;
}

export class ProductInfoResultDto {
    @ApiProperty({
        description: 'Product url',
    })
    url: string;

    @ApiProperty({
        description: 'Product title',
    })
    title: string;

    @ApiProperty({
        description: 'Product code',
    })
    code: string;

    @ApiProperty({
        description: 'Product rating',
    })
    rating: number;

    @ApiProperty({
        description: 'Product unit price',
    })
    unitPrice: number;

    @ApiProperty({
        description: 'Product images urls',
    })
    galleryImages: string[];

    @ApiProperty({
        description: 'Product reviews quantity',
    })
    reviewsQuantity: number;

    @ApiProperty({
        description: 'History period in days',
    })
    period: number;

    @ApiProperty({
        description: 'Date of last check',
    })
    dateLastCheck: string;

    @ApiProperty({
        description: 'Prices history',
    })
    prices?: { [key: string]: number };

    @ApiProperty({
        description: 'Reviews history',
    })
    reviews?: { [key: string]: number };

    @ApiProperty({
        description: 'Ratings history',
    })
    ratings?: { [key: string]: number };

    @ApiProperty({
        description: 'Sellers history',
    })
    sellers?: { [key: string]: number };
}
