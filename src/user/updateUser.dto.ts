import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, Length, Matches } from 'class-validator';
import { PASSWORD_RULE } from './rules';
import { UserRoleEnum } from './types';
import { IsAlreadyRegister } from './isAlreadyRegister.validation';
import { ApiContextAwareDto } from '../common/context-aware.dto';

export class UpdateUserRequestDto extends ApiContextAwareDto {
    @ApiProperty({
        description: 'The email address of the User',
        example: 'jhon.doe@gmail.com',
    })
    @IsOptional()
    @IsEmail()
    @IsAlreadyRegister()
    email?: string;

    @ApiProperty({
        description: 'The password of the User',
        example: 'Password@123',
    })
    @IsOptional()
    @Length(8, 24)
    @Matches(PASSWORD_RULE.value, { message: PASSWORD_RULE.message })
    password?: string;

    @ApiProperty({
        description: 'The roles of the User',
        example: ['none'],
        isArray: true,
        enum: UserRoleEnum,
    })
    @IsOptional()
    roles?: UserRoleEnum[];
}
