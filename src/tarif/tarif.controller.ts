import { Controller, Delete, Get, UseGuards, Param, Body, Query, Post, Patch } from '@nestjs/common';
import { ApiBadRequestResponse, ApiBearerAuth, ApiCreatedResponse, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AuthTokenGuard } from 'src/auth/token/authToken.guard';
import { HasRoles } from 'src/user/roles/roles.decorator';
import { UserRoleEnum } from 'src/user/types';
import { UserRolesGuard } from 'src/user/roles/roles.guard';
import { TarifService } from './tarif.service';
import { AddTarifRequestDTO, GetTarifsResponseDTO, PatchTarifRequestDTO, TarifDTO } from './tarif.dto';

@ApiTags('Tarifs')
@Controller('/api/tarifs')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class TarifController {
    constructor(private tarifService: TarifService) {}

    @Get('')
    @HasRoles(UserRoleEnum.admin, UserRoleEnum.siteUser, UserRoleEnum.premiumUser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'List of tarifs',
        type: GetTarifsResponseDTO,
    })
    async list(): Promise<GetTarifsResponseDTO> {
        const tarifs = await this.tarifService.fetchAll();
        return { items: tarifs };
    }

    @Get('/:id')
    @HasRoles(UserRoleEnum.admin, UserRoleEnum.siteUser, UserRoleEnum.premiumUser)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Get tarif by id',
        type: TarifDTO,
    })
    async get(@Param('id') id: number): Promise<TarifDTO> {
        const tarif = await this.tarifService.fetchOne(id);
        return tarif;
    }

    /*
    @Delete('/:id')
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    async delete(@Param('id') id: number): Promise<{ success: boolean }> {
        const result = await this.tarifService.delete(id);
        return { success: result };
    }
    */

    /*
    @Post('')
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Create new tarif',
        type: TarifDTO,
    })
    @ApiBadRequestResponse({
        description: 'Culd not add new tarif',
    })
    async add(@Body() req: AddTarifRequestDTO): Promise<TarifDTO> {
        const tarif = await this.tarifService.add(req);
        return tarif;
    }
    */

    /*
    @Patch('/:id')
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Change tarif',
        type: TarifDTO,
    })
    @ApiBadRequestResponse({
        description: 'Culd not change tarif',
    })
    async patch(@Param('id') id: number, @Body() req: PatchTarifRequestDTO): Promise<TarifDTO> {
        const tarif = await this.tarifService.update(id, req);
        return tarif;
    }
    */
}
