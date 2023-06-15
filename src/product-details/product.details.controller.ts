import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import {
    ApiCreatedResponse,
    ApiQuery,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import {
    DataTypesEnum,
    ModeEnum,
    ProductDetailsService,
} from './product.details.service';
import { ProductUrlPipe } from './productUrl.pipe';
import { ProductPeriodPipe } from './productPeriod.pipe';
import { ProductDataTypesPipe } from './productDataTypes.pipe';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ProductModePipe } from './productMode.pipe';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import { ProductDetailsDto } from './product.details.dto';
import { dateToStr } from 'src/utils';
import { UserRequestGuard } from 'src/user/user.request.guard';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';

@ApiTags('Product')
@Controller('/api/product-details')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard)
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class ProductDetailsController {
    constructor(private productService: ProductDetailsService) {}

    @Get('?')
    @HasRoles(UserRoleEnum.siteUser, UserRoleEnum.chromeExtension)
    @UseGuards(UserRequestGuard)
    @ApiCreatedResponse({
        description: 'Return information about product by url or code',
        type: ProductDetailsDto,
    })
    @ApiQuery({
        name: 'q',
        type: String,
        description: 'Product url or code',
        required: true,
    })
    @ApiQuery({
        name: 'period',
        type: Number,
        description: 'Period',
        required: true,
    })
    @ApiQuery({
        enum: DataTypesEnum,
        isArray: true,
        name: 'data_type',
        description: 'Set of data typees',
        required: true,
        example: [
            DataTypesEnum.prices,
            DataTypesEnum.rating,
            DataTypesEnum.reviews,
            DataTypesEnum.sellers,
        ],
    })
    @ApiQuery({
        enum: ModeEnum,
        name: 'mode',
        description: 'Mode of response',
        required: false,
        example: ModeEnum.dates,
    })
    async getProductInfo(
        @Query('q', new ProductUrlPipe())
        productCode: string,
        @Query('period', new ProductPeriodPipe())
        period: number,
        @Query('data_type', new ProductDataTypesPipe())
        types: DataTypesEnum[],
        @Query('mode', new ProductModePipe())
        mode?: ModeEnum,
    ): Promise<ProductDetailsDto> {
        const product = await this.productService.fetchOne(productCode);
        if (!product) {
            throw new NotFoundException(
                `Product is not found by code ${productCode}`,
            );
        }
        const stat = await (mode === ModeEnum.values
            ? this.productService.fetchStatByValues(product.id, period, types)
            : this.productService.fetchStatByDates(product.id, period, types));
        const result: ProductDetailsDto = {
            code: product.code,
            dateLastCheck:
                (product.lastCheckedAt && dateToStr(product.lastCheckedAt)) ||
                '',
            galleryImages:
                (product.galleryImages &&
                    product.galleryImages.reduce((r: string[], item) => {
                        r.push(...(Object.values(item) as string[]));
                        return r;
                    }, [])) ||
                [],
            period: period,
            rating: product.productRating,
            reviewsQuantity: product.reviewsQuantity,
            title: product.title,
            unitPrice: product.unitPrice,
            url: product.url,
            ...stat,
        };
        return result;
    }
}
