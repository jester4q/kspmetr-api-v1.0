import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, Length, Matches, ValidateIf } from 'class-validator';
import { FINGERPRINT_RULE } from 'src/user/rules';

export class AuthLoginRequestDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password in plain text',
    })
    @IsNotEmpty()
    password: string;
}

export class AuthLoginFingerprintRequestDto {
    @ApiProperty({
        description: 'Fingerprint',
    })
    @Length(32, 32)
    @Matches(FINGERPRINT_RULE.value, { message: FINGERPRINT_RULE.message })
    fingerprint: string;
}

export class AuthLoginResultDto {
    @ApiProperty({
        description: 'User token',
    })
    token: string;
}
