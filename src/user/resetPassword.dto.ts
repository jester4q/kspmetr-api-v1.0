import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { IsEmailRegistered } from './isEmailRegistered.validation';

export class ResetPasswodRequestDto {
    @ApiProperty({
        description: 'The email address of the User',
        example: 'jhon.doe@gmail.com',
    })
    @IsEmail()
    @IsEmailRegistered()
    email: string;
}
