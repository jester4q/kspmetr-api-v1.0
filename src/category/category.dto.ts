import { ApiProperty, getSchemaPath } from '@nestjs/swagger';

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
    name: string;
    @ApiProperty({
        description: 'Category url',
    })
    url: string;
}

export class SaveCategoriesRequestDTO {
    @ApiProperty({
        description: 'Reason of delete',
        type: 'array',
        items: { $ref: getSchemaPath(SaveCategoriesRequestDTOItem) },
    })
    categories: SaveCategoriesRequestDTOItem[];
}
