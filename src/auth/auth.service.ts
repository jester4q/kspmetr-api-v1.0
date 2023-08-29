import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { AuthTokensService } from './token/authToken.service';
import { AuthSession } from '../common/db/entities';

import { ApiError, ForbiddenApiError, NotFoundApiError } from 'src/common/error';
import { UserRoleEnum } from 'src/user/types';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthSession)
        private sessionRepository: Repository<AuthSession>,

        private userService: UserService,
        private tokenService: AuthTokensService,
    ) {}

    async logout(userId: number): Promise<any> {
        await this.sessionRepository.update({ userId: userId, active: true }, { active: false });
        return {};
    }

    async loginByEmail(email: string, password: string): Promise<string> {
        const user = await this.userService.findByEmail(email);

        if (user.roles.length == 1 && user.roles.includes(UserRoleEnum.chromeExtension)) {
            throw new ForbiddenApiError('Login by email is forbidden');
        }

        if (!user) {
            throw new ApiError('The email address or password is incorrect');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new ApiError('The email address or password is incorrect');
        }
        const token = await this.tokenService.sign(user);
        return token;
    }

    async loginByFingerprint(fingerprint: string): Promise<string> {
        const user = await this.userService.findByFingerprint(fingerprint);
        if (!user) {
            throw new NotFoundApiError('The fingerprint is incorrect');
        }
        if (!user.roles.includes(UserRoleEnum.chromeExtension)) {
            throw new ForbiddenApiError('Login by fingerprint is forbidden');
        }
        const token = await this.tokenService.sign(user);
        return token;
    }

    async validateUser(email: string, password: string): Promise<any> {
        const user = await this.userService.findByEmail(email);
        if (user && (await bcrypt.compare(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
}
