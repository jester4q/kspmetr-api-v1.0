import { Body, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from '../../auth/token/authToken.guard';
import { UserResultDto } from './user.dto';
import { UserService } from '../user.service';
import { SessionUser } from '../../auth/token/sessionUser.decorator';
import { AddUserRequestDto } from './addUser.dto';
import { UpdateUserRequestDto } from './updateUser.dto';
import { UserRoleEnum } from '../types';
import { HasRoles } from '../roles/roles.decorator';
import { User } from '../../db/entities';
import { UserRolesGuard } from '../roles/roles.guard';
import { TSessionUser } from 'src/auth/token/authToken.service';

@ApiTags('User')
@Controller('/api/user')
@ApiSecurity('bearer')
@UseGuards(AuthTokenGuard, UserRolesGuard)
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Current user info',
        type: UserResultDto,
    })
    @ApiBadRequestResponse({
        description: "User did'n sign in",
    })
    async user(@SessionUser() session: TSessionUser): Promise<UserResultDto> {
        const user = await this.userService.findById(session.userId);
        if (!user) {
            throw new BadRequestException('Culd not find current user');
        }
        return this.mapUserToDto(user);
    }

    @Post('')
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Create new user',
        type: UserResultDto,
    })
    @ApiBadRequestResponse({
        description: 'Culd not add new user',
    })
    async addUser(@Body() req: AddUserRequestDto): Promise<UserResultDto> {
        try {
            const user = await this.userService.add(req);
            return this.mapUserToDto(user);
        } catch {
            throw new BadRequestException('Culd not add new user');
        }
    }

    @Patch('/:id')
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        description: 'Update user',
        type: UserResultDto,
    })
    @ApiBadRequestResponse({
        description: 'Culd not update user data',
    })
    async patchUser(
        @Param('id') id: number,
        @Body() req: UpdateUserRequestDto,
    ): Promise<UserResultDto> {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new BadRequestException('Culd not find user by id' + id);
        }
        try {
            const updatedUser = await this.userService.upate(id, req);
            return this.mapUserToDto(updatedUser);
        } catch {
            throw new BadRequestException('Culd not add new user');
        }
    }

    private mapUserToDto(user: User): UserResultDto {
        return {
            id: user.id,
            email: user.email,
            roles: user.roles,
        };
    }
}
