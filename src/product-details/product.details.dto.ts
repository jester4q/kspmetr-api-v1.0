import { ApiProperty } from '@nestjs/swagger';

export class ProductDetailsDto {
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
    prices?: { [key: string]: string };

    @ApiProperty({
        description: 'Reviews history',
    })
    reviews?: { [key: string]: string };

    @ApiProperty({
        description: 'Ratings history',
    })
    ratings?: { [key: string]: string };

    @ApiProperty({
        description: 'Sellers history',
    })
    sellers?: { [key: string]: string };
}
