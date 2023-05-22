import { Controller, Get, Param, UseGuards, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProductService } from './product.service';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { CategoryService } from 'src/category/category.service';
import { TCategory } from 'src/category/category.types';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import {
    GetCategoryProductsQueryDto,
    GetCategoryProductsResponseDto,
} from './product.list.dto';

@ApiTags('Product')
@Controller('/api/products')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class ProductListController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) {}

    @Get('/:categoryId')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'List of product of some category',
        type: GetCategoryProductsResponseDto,
    })
    async list(
        @Param('categoryId') categoryId: number,
        @Query() query: GetCategoryProductsQueryDto,
    ): Promise<GetCategoryProductsResponseDto> {
        let category;
        const { reverse } = query;
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
                    reverse,
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
