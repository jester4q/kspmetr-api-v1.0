import {
    Controller,
    Get,
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
import { GetCategoryProductsResponseDTO } from './product.dto';
import { ProductService } from './product.service';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { CategoryService } from 'src/category/category.service';
import { TCategory } from 'src/category/category.types';
import { TProduct } from './product.types';
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

@ApiTags('Product')
@Controller('/api/products')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) {}

    @Get('/:categoryId')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'List of product of some category',
        type: GetCategoryProductsResponseDTO,
    })
    async list(
        @Param('categoryId') categoryId: number,
    ): Promise<GetCategoryProductsResponseDTO> {
        let category;
        try {
            category = await this.categoryService.fetchTree(categoryId);
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not get category by id ' + categoryId,
            );
        }
        if (!category) {
            throw new NotFoundException(
                `Category is not found by id ${categoryId}`,
            );
        }
        const categoryIds = this.get3LevelCategories(category);
        if (categoryIds.length) {
            try {
                const products = await this.productService.fetchAllInCategory(
                    categoryIds,
                );
                return { items: products };
            } catch (e) {
                throw new InternalServerErrorException(
                    'Culd not get products of the category',
                );
            }
        }
        return { items: [] };
    }

    @Post('')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Save roduct of some category',
        type: GetCategoryProductsResponseDTO,
    })
    async add(
        @SessionUser() user: TSessionUser,
        @Body() product: AddProductRequestDTO,
    ): Promise<TProduct> {
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
        type: GetCategoryProductsResponseDTO,
    })
    @UsePipes(new ValidationPipe({ transform: true }))
    async addDetailed(
        @SessionUser() user: TSessionUser,
        @Body() product: AddDetailedProductRequestDTO,
    ): Promise<TProduct> {
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
        type: GetCategoryProductsResponseDTO,
    })
    async save(
        @SessionUser() user: TSessionUser,
        @Param('id') id: number,
        @Body() product: SaveProductRequestDTO,
    ): Promise<TProduct> {
        try {
            const model = new ProductModel(product);
            return this.productService.save(user, id, model);
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not save product history',
            );
        }
    }

    private get3LevelCategories(category: TCategory): number[] {
        if (!category.children || !category.children.length) {
            return [category.id];
        }
        const result = [];
        if (category.children) {
            for (let i = 0; i < category.children.length; i++) {
                const ids = this.get3LevelCategories(category.children[i]);
                result.push(...ids);
            }
        }
        return result;
    }
}
