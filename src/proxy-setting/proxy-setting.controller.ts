import {
    Controller,
    Delete,
    Get,
    UseGuards,
    Param,
    Body,
    InternalServerErrorException,
    BadRequestException,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProxySettingService } from './proxy-setting.service';
import {
    DeleteProxySettingsRequestDTO,
    GetProxySettingsResponseDTO,
} from './proxy-setting.dto';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';

@ApiTags('Proxy Settings')
@Controller('/api/proxy-settings')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class ProxySettingController {
    constructor(private proxySettingService: ProxySettingService) {}

    @Get('')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'List of proxy settings',
        type: GetProxySettingsResponseDTO,
    })
    async list(): Promise<GetProxySettingsResponseDTO> {
        try {
            const settings = await this.proxySettingService.fetchAll();
            return { items: settings };
        } catch (error) {
            throw new InternalServerErrorException(
                'Could not get proxy settings',
            );
        }
    }

    @Delete('/:id')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    async delete(
        @Param('id') id,
        @Body() req: DeleteProxySettingsRequestDTO,
    ): Promise<{ id: number }> {
        try {
            const proxy = await this.proxySettingService.fetchOne(id);
        } catch (e) {
            throw new BadRequestException(
                'There is no proxy setings with id ' + id,
            );
        }
        try {
            await this.proxySettingService.delete(id, req.reason);
        } catch (e) {
            throw new InternalServerErrorException(
                'Could not delete proxy settings by id ' + id,
            );
        }
        return { id: id };
    }
}
