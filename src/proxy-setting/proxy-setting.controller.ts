import { Controller, Delete, Get, UseGuards, Param, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProxySettingService } from './proxy-setting.service';
import { DeleteProxySettingsRequestDTO, GetProxySettingsResponseDTO } from './proxy-setting.dto';
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
    @ApiQuery({
        name: 'section',
        description: 'Proxy section',
        required: false,
    })
    async list(@Query('section') section: number = 0): Promise<GetProxySettingsResponseDTO> {
        const settings = await this.proxySettingService.fetchAll(section);
        return { items: settings };
    }

    @Delete('/:id')
    @HasRoles(UserRoleEnum.parser)
    @ApiBearerAuth()
    async delete(@Param('id') id, @Body() req: DeleteProxySettingsRequestDTO): Promise<{ success: boolean }> {
        // const proxy = await this.proxySettingService.fetchOne(id);
        const result = await this.proxySettingService.delete(id, req.reason);
        return { success: result };
    }
}
