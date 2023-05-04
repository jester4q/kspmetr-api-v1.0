import {
    Controller,
    Param,
    UseGuards,
    Put,
    Body,
    Post,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProductService } from './product.service';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { CategoryService } from 'src/category/category.service';
import {
    AddDetailedProductModel,
    AddProductModel,
    ProductModel,
} from './product.model';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import { SessionUser } from 'src/auth/token/sessionUser.decorator';
import { TSessionUser } from 'src/auth/token/authToken.service';
import { AddProductRequestDTO } from './add.product.dto';
import { SaveProductRequestDTO } from './save.product.dto';
import { AddDetailedProductRequestDTO } from './add.detailed.product.dto';
import { UserRequestGuard } from 'src/user/user.request.guard';
import { ProductDto } from './product.dto';

@ApiTags('Product')
@Controller('/api/products')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class ProductController {
    constructor(private productService: ProductService) {}

    @Post('')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Save roduct of some category',
        type: ProductDto,
    })
    async add(
        @SessionUser() user: TSessionUser,
        @Body() product: AddProductRequestDTO,
    ): Promise<ProductDto> {
        console.log(product);
        try {
            const model = new AddProductModel(product);
            const result = await this.productService.add(user, model);
            return result;
        } catch (e) {
            throw new InternalServerErrorException('Culd not add products');
        }
    }

    @Post('/detailed')
    @HasRoles(UserRoleEnum.chromeExtension)
    @UseGuards(UserRequestGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Add product of some category',
        type: ProductDto,
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addDetailed(
        @SessionUser() user: TSessionUser,
        @Body() product: AddDetailedProductRequestDTO,
    ): Promise<ProductDto> {
        try {
            const model = new AddDetailedProductModel(product);
            const result = await this.productService.addAndUpdate(user, model);
            return result;
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not add(update) product. ' + e.message,
            );
        }
    }

    @Put('/:id')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Save roduct of some category',
        type: ProductDto,
    })
    async save(
        @SessionUser() user: TSessionUser,
        @Param('id') id: number,
        @Body() product: SaveProductRequestDTO,
    ): Promise<ProductDto> {
        console.log(product);
        try {
            const model = new ProductModel(product);
            return this.productService.save(user, id, model);
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not save product history',
            );
        }
    }
}
