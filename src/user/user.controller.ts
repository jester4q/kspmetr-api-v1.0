import {
    Body,
    Get,
    InternalServerErrorException,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiSecurity,
    ApiTags,
} from '@nestjs/swagger';
import { AuthTokenGuard } from '../auth/token/authToken.guard';
import { UserResultDto } from './user.dto';
import { UserService } from './user.service';
import { SessionUser } from '../auth/token/sessionUser.decorator';
import { AddUserRequestDto } from './addUser.dto';
import { UpdateUserRequestDto } from './updateUser.dto';
import { UserRoleEnum } from './types';
import { HasRoles } from './roles/roles.decorator';
import { User } from '../db/entities';
import { UserRolesGuard } from './roles/roles.guard';
import { TSessionUser } from '../auth/token/authToken.service';
import { SignupUserRequestDto } from './signupUser.dto';

@ApiTags('User')
@Controller('/api/user')
export class UserController {
    constructor(private userService: UserService) {}

    @Get('')
    @UseGuards(AuthTokenGuard)
    @ApiBearerAuth()
    @ApiSecurity('bearer')
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
    @UseGuards(AuthTokenGuard, UserRolesGuard)
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiSecurity('bearer')
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
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Post('/signup')
    @ApiCreatedResponse({
        description: 'Sign up new user',
        type: UserResultDto,
    })
    @ApiBadRequestResponse({
        description: 'Culd not add new user',
    })
    async signupUser(
        @Body() req: SignupUserRequestDto,
    ): Promise<UserResultDto> {
        if (req.email && !req.password) {
            throw new BadRequestException('Password is requred');
        }
        try {
            const user = await this.userService.signup({ ...req, roles: [] });
            return this.mapUserToDto(user);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    @Patch('/:id')
    @UseGuards(AuthTokenGuard, UserRolesGuard)
    @HasRoles(UserRoleEnum.admin)
    @ApiBearerAuth()
    @ApiSecurity('bearer')
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
            const updatedUser = await this.userService.update(id, req);
            return this.mapUserToDto(updatedUser);
        } catch (error) {
            throw new InternalServerErrorException(error.message);
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
