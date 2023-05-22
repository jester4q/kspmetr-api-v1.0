import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CategoryDTO {
    @ApiProperty({
        description: 'Category id',
    })
    id: number;

    @ApiProperty({
        description: 'Category name',
    })
    name: string;

    @ApiProperty({
        description: 'Category level',
    })
    level: number;

    @ApiProperty({
        description: 'Category url',
    })
    url: string;
}

export class GetCategoriesResponseDTO extends CategoryDTO {
    children?: CategoryDTO[];
}

export class SaveCategoriesRequestDTOItem {
    @ApiProperty({
        description: 'Category name',
    })
    @IsNotEmpty()
    @IsString()
    name: string;
    @ApiProperty({
        description: 'Category url',
    })
    @IsNotEmpty()
    @IsUrl()
    url: string;
}

export class SaveCategoriesRequestDTO {
    @ApiProperty({
        description: 'Categories for save',
        type: 'array',
        items: { $ref: getSchemaPath(SaveCategoriesRequestDTOItem) },
    })
    @IsNotEmpty()
    @IsArray()
    categories: SaveCategoriesRequestDTOItem[];
}
