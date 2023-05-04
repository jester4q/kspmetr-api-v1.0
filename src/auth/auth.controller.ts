import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthTokenGuard } from './token/authToken.guard';
import { AuthLoginRequestDto, AuthLoginResultDto } from './authLogin.dto';
import { SessionUser } from './token/sessionUser.decorator';
import { TSessionUser } from './token/authToken.service';

@ApiTags('Auth')
@Controller('/api/auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @ApiCreatedResponse({
        description: 'user token as response',
        type: AuthLoginResultDto,
    })
    @ApiBadRequestResponse({ description: 'User cannot sign up.' })
    async login(@Body() req: AuthLoginRequestDto): Promise<AuthLoginResultDto> {
        const token = await this.authService.login(req.email, req.password);
        return { token: token };
    }

    @ApiBearerAuth()
    @UseGuards(AuthTokenGuard)
    @Get('logout')
    async logout(@SessionUser() user: TSessionUser) {
        return this.authService.logout(user.userId);
    }
}
