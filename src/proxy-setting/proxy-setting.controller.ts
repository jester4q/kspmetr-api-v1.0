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
import { ApiCreatedResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { ProxySettingService } from './proxy-setting.service';
import {
    DeleteProxySettingsRequestDTO,
    GetProxySettingsResponseDTO,
} from './proxy-setting.dto';

@ApiTags('Proxy Settings')
@Controller('/api/proxy-settings')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard)
export class ProxySettingController {
    constructor(private proxySettingService: ProxySettingService) {}

    @Get('')
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
