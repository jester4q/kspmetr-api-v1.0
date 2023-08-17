import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, Length, Matches } from 'class-validator';
import { PASSWORD_RULE } from './rules';

export class NewPasswodRequestDto {
    @ApiProperty({
        description: 'New password',
        example: '*******',
    })
    @IsNotEmpty()
    @Length(8, 24)
    @Matches(PASSWORD_RULE.value, { message: PASSWORD_RULE.message })
    password: string;

    @ApiProperty({
        description: 'Verification token',
        example: 'abracadabra',
    })
    @IsNotEmpty()
    token: string;
}
