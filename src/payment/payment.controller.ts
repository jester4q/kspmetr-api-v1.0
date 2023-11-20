import { Controller, Get, UseGuards, Param, Body, Post } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import { AddPaymentRequestDTO, PaymentDTO } from './payment.dto';
import { PaymentService } from './payment.service';
import { TSessionUser } from 'src/auth/token/authToken.service';
import { SessionUser } from 'src/auth/token/sessionUser.decorator';

@ApiTags('Payments')
@Controller('/api/payments')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Get('/verify/:token')
    @HasRoles(UserRoleEnum.admin, UserRoleEnum.siteUser, UserRoleEnum.premiumUser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Check payment token',
        type: PaymentDTO,
    })
    async verifyToken(@Param('token') token: string): Promise<PaymentDTO> {
        const payment = await this.paymentService.verifyToken(token);
        return payment;
    }

    @Post('')
    @HasRoles(UserRoleEnum.admin, UserRoleEnum.siteUser, UserRoleEnum.premiumUser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Create new tarif',
        type: PaymentDTO,
    })
    @ApiBadRequestResponse({
        description: 'Culd not add new paynment',
    })
    async add(@SessionUser() user: TSessionUser, @Body() req: AddPaymentRequestDTO): Promise<PaymentDTO> {
        const tarif = await this.paymentService.add(user, req);
        return tarif;
    }
}
