import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Validate, isEnum } from 'class-validator';
import { IsNumberOrString } from 'src/product/numberOrString.validator';
import { PaymentStatusEnum } from './types';

export class PaymentDTO {
    @ApiProperty({
        description: 'Payment id',
    })
    id: number;

    @ApiProperty({
        description: 'Tarif name',
    })
    name: string;

    @ApiProperty({
        description: 'Payment amount price',
    })
    amount: number;

    @ApiProperty({
        description: 'Payment status',
    })
    status: PaymentStatusEnum;
    @ApiProperty({
        description: 'Payment token',
    })
    token?: string;
}

export class AddPaymentRequestDTO {
    @ApiProperty({
        description: 'Traif id',
    })
    @IsNotEmpty()
    tarifId: number;

    /*
    @ApiProperty({
        description: 'Tarif name for payment',
    })
    @IsOptional()
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Payment amount',
    })
    @IsOptional()
    @Validate(IsNumberOrString)
    amount: number;
    */
}
