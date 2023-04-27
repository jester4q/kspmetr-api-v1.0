import {
    Controller,
    Get,
    UseGuards,
    Param,
    Body,
    BadRequestException,
    InternalServerErrorException,
    Post,
    Query,
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiBody,
    ApiCreatedResponse,
    ApiProperty,
    ApiQuery,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import {
    GetCategoriesResponseDTO,
    SaveCategoriesRequestDTO,
} from './category.dto';
import { CategoryService } from './category.service';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import { SessionUser } from 'src/auth/token/sessionUser.decorator';
import { TSessionUser } from 'src/auth/token/authToken.service';

@ApiTags('Product categories')
@Controller('/api/categories')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class CategoryController {
    constructor(private categoryService: CategoryService) {}

    @Get('/:parentId')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiProperty({ name: 'parentId', required: true })
    @ApiQuery({ name: 'depth', required: false })
    @ApiCreatedResponse({
        description: 'Tree of categories',
        type: GetCategoriesResponseDTO,
    })
    @ApiBadRequestResponse({ description: 'Product is not found by request' })
    async list(
        @Param('parentId') parentId: number,
        @Query('depth') depth?: number,
    ): Promise<GetCategoriesResponseDTO> {
        try {
            const parent = this.categoryService.fetchOne(parentId);
        } catch (e) {
            throw new BadRequestException(
                'Thre is no parent category with id ' + parentId,
            );
        }
        try {
            const categories = await this.categoryService.fetchTree(
                parentId,
                depth,
            );
            return categories;
        } catch (e) {
            throw new InternalServerErrorException(
                'Could not get categories by the request',
            );
        }
    }

    @Post('/:parentId')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiProperty({ name: 'parentId', required: true })
    @ApiBody({ required: true })
    async save(
        @SessionUser() user: TSessionUser,
        @Param('parentId') parentId: number,
        @Body() req: SaveCategoriesRequestDTO,
    ): Promise<{}> {
        try {
            const parent = this.categoryService.fetchOne(parentId);
        } catch (e) {
            throw new BadRequestException(
                'There is no parent category with id ' + parentId,
            );
        }
        try {
            await this.categoryService.save(parentId, req.categories);
        } catch (e) {
            throw new InternalServerErrorException(
                'Could not save categories by the request',
            );
        }
        return {};
    }
}
