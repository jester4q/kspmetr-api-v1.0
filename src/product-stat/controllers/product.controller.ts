import {
    BadRequestException,
    Controller,
    Get,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProductInfoResultDto } from './product.dto';
import { DataTypesEnum, ProductService } from '../product.service';
import { ProductUrlPipe } from './productUrl.pipe';
import { ProductPeriodPipe } from './productPeriod.pipe';
import { ProductDataTypesPipe } from './productDataTypes.pipe';
import { NotFoundException } from '@nestjs/common/exceptions';

@ApiTags('Product')
@Controller('/api/products')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard)
export class ProductController {
    constructor(private productService: ProductService) {}

    @Get('/stat')
    @ApiCreatedResponse({
        description: 'Information about product as response',
        type: ProductInfoResultDto,
    })
    @ApiBadRequestResponse({ description: 'Product is not found by request' })
    async getProductInfo(
        @Query('q', new ProductUrlPipe())
        productCode: string,
        @Query('period', new ProductPeriodPipe())
        period: number,
        @Query('data_type', new ProductDataTypesPipe())
        types: DataTypesEnum[],
    ): Promise<ProductInfoResultDto> {
        const product = await this.productService.fetchOne(productCode);
        if (!product) {
            throw new NotFoundException(
                `Product is not found by code ${productCode}`,
            );
        }
        const result: ProductInfoResultDto = {
            code: product.code,
            dateLastCheck: product.lastCheckedAt.toISOString().split('T')[0],
            galleryImages: product.galleryImages.reduce((r: string[], item) => {
                r.push(...Object.values(item));
                return r;
            }, []),
            period: period,
            rating: product.productRating,
            reviewsQuantity: product.reviewsQuantity,
            title: product.title,
            unitPrice: product.unitPrice,
            url: product.url,
            ...(await this.productService.fetchStat(product.id, period, types)),
        };
        return result;
    }
}
