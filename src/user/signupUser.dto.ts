import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    Length,
    Matches,
    ValidateIf,
} from 'class-validator';
import { PASSWORD_RULE, FINGERPRINT_RULE } from './rules';
import { IsAlreadyRegister } from './isAlreadyRegister.validation';

export class SignupUserRequestDto {
    @ApiProperty({
        description: 'The email address of the User',
        example: 'jhon.doe@gmail.com',
    })
    @IsOptional()
    @IsEmail()
    @IsAlreadyRegister()
    email: string;

    @ApiProperty({
        description: 'The email address of the User',
        example: 'jhon.doe@gmail.com',
    })
    @IsNotEmpty()
    @Length(32, 32)
    @Matches(FINGERPRINT_RULE.value, { message: FINGERPRINT_RULE.message })
    @IsAlreadyRegister()
    fingerprint: string;

    @ApiProperty({
        description: 'The password of the User',
        example: 'Password@123',
    })
    @ValidateIf((o) => o.email)
    @Length(8, 24)
    @Matches(PASSWORD_RULE.value, { message: PASSWORD_RULE.message })
    password: string;
}
