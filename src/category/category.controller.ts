import {
    Controller,
    Get,
    UseGuards,
    Param,
    Body,
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
        const categories = await this.categoryService.fetchTree(
            parentId,
            depth,
        );
        return categories;
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
        await this.categoryService.save(parentId, req.categories);
        return {};
    }
}
