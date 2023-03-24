import {
    Controller,
    Get,
    Param,
    UseGuards,
    Put,
    Body,
    Post,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import {
    AddProductRequestDTO,
    GetCategoryProductsResponseDTO,
    GetProductsResponseDTO,
    SaveProductRequestDTO,
} from './product.dto';
import { ProductService } from './product.service';
import {
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common/exceptions';
import { CategoryService } from 'src/category/category.service';
import { TCategory } from 'src/category/category.types';
import { TProduct } from './product.types';
import { AddProductModel, ProductModel } from './product.model';

@ApiTags('Product')
@Controller('/api/products')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard)
export class ProductController {
    constructor(
        private productService: ProductService,
        private categoryService: CategoryService,
    ) {}

    @Get('/:categoryId')
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
    @ApiCreatedResponse({
        description: 'Save roduct of some category',
        type: GetCategoryProductsResponseDTO,
    })
    async add(@Body() product: AddProductRequestDTO): Promise<TProduct> {
        try {
            console.log('ADD', product);
            const model = new AddProductModel(product);
            const result = await this.productService.add(model);
            console.log('RESULT', result);
            return result;
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not get products of the category',
            );
        }
    }

    @Put('/:id')
    @ApiCreatedResponse({
        description: 'Save roduct of some category',
        type: GetCategoryProductsResponseDTO,
    })
    async save(
        @Param('id') id: number,
        @Body() product: SaveProductRequestDTO,
    ): Promise<TProduct> {
        try {
            const model = new ProductModel(product);
            return this.productService.save(id, model);
        } catch (e) {
            throw new InternalServerErrorException(
                'Culd not get products of the category',
            );
        }
    }

    private get3LevelCategories(category: TCategory): number[] {
        if (category.level == 3) {
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
