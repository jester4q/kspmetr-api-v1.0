import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthLoginRequestDto {
    @ApiProperty({
        description: 'Email address of the user',
    })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'Password in plain text',
    })
    @IsNotEmpty()
    password: string;
}

export class AuthLoginResultDto {
    @ApiProperty({
        description: 'User token',
    })
    token: string;
}
