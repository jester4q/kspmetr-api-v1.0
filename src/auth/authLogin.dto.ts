import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsOptional,
    Length,
    Matches,
    ValidateIf,
} from 'class-validator';
import { FINGERPRINT_RULE } from 'src/user/rules';

export class AuthLoginRequestDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsOptional()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Fingerprint',
    })
    @IsOptional()
    @Length(32, 32)
    @Matches(FINGERPRINT_RULE.value, { message: FINGERPRINT_RULE.message })
    fingerprint: string;

    @ApiProperty({
        description: 'Password in plain text',
    })
    @ValidateIf((o) => o.email)
    @IsNotEmpty()
    password: string;
}

export class AuthLoginResultDto {
    @ApiProperty({
        description: 'User token',
    })
    token: string;
}
