import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length, Matches } from 'class-validator';
import { PASSWORD_RULE } from '../rules';
import { UserRoleEnum } from '../types';

export class AddUserRequestDto {
    @ApiProperty({
        description: 'The email address of the User',
        example: 'jhon.doe@gmail.com',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'The password of the User',
        example: 'Password@123',
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(PASSWORD_RULE.value, { message: PASSWORD_RULE.message })
    password: string;

    @ApiProperty({
        description: 'The roles of the User',
        example: ['none'],
        isArray: true,
        enum: UserRoleEnum,
    })
    roles: UserRoleEnum[];
}
