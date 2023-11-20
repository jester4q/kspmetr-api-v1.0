import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, Validate, isEnum } from 'class-validator';
import { IsNumberOrString } from 'src/product/numberOrString.validator';
import { UserRoleEnum } from 'src/user/types';

export class TarifDTO {
    @ApiProperty({
        description: 'Tarif id',
    })
    id: number;

    @ApiProperty({
        description: 'User role',
    })
    role: UserRoleEnum;

    @ApiProperty({
        description: 'Tarif name',
    })
    name: string;

    @ApiProperty({
        description: 'Tarif price',
    })
    price: number;

    @ApiProperty({
        description: 'Months',
    })
    months: number;
}

export class GetTarifsResponseDTO {
    @ApiProperty({
        description: 'Tarifs list',
    })
    items: TarifDTO[];
}

export class AddTarifRequestDTO {
    @ApiProperty({
        description: 'User role',
    })
    @IsNotEmpty()
    @IsEnum(UserRoleEnum)
    role: UserRoleEnum;

    @ApiProperty({
        description: 'Tarif name',
    })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Tarif price',
    })
    @IsNotEmpty()
    @Validate(IsNumberOrString)
    price: number;

    @ApiProperty({
        description: 'Months',
    })
    @IsNotEmpty()
    @Validate(IsNumberOrString)
    months: number;
}

export class PatchTarifRequestDTO {
    @ApiProperty({
        description: 'User role',
    })
    @IsOptional()
    @IsEnum(UserRoleEnum)
    role?: UserRoleEnum;

    @ApiProperty({
        description: 'Tarif name',
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        description: 'Tarif price',
    })
    @IsOptional()
    @Validate(IsNumberOrString)
    price?: number;

    @ApiProperty({
        description: 'Months',
    })
    @IsOptional()
    @Validate(IsNumberOrString)
    months?: number;
}
