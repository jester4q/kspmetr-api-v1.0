import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from './types';

export class UserResultDto {
    @ApiProperty({
        description: 'ID of the User',
    })
    id: number;

    @ApiProperty({
        description: 'The email address of the User',
    })
    email: string;

    @ApiProperty({
        description: 'Roles of the User',
    })
    roles: UserRoleEnum[];
}
