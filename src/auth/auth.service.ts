import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { AuthTokensService } from './token/authToken.service';
import { AuthSession } from '../db/entities';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AuthSession)
        private sessionRepository: Repository<AuthSession>,
        private userService: UserService,
        private tokenService: AuthTokensService,
    ) {}

    async logout(userId: number): Promise<any> {
        await this.sessionRepository.update(
            { userId: userId, active: true },
            { active: false },
        );
        return {};
    }

    async loginByEmail(email: string, password: string): Promise<string> {
        // Check if user exists
        const user = await this.userService.findByEmail(email);
        if (!user) {
            throw new BadRequestException('User does not exist');
        }
        if (!(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Password is incorrect');
        }
        const token = await this.tokenService.sign(user);
        return token;
    }

    async loginByFingerprint(fingerprint: string): Promise<string> {
        // Check if user exists
        const user = await this.userService.findByFingerprint(fingerprint);
        if (!user) {
            throw new BadRequestException('User does not exist');
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
