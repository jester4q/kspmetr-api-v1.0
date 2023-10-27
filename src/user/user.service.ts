import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Any, In, Repository } from 'typeorm';
import { EmailVerification, User, UserLimits } from '../common/db/entities';
import { TUserAdd, TUserUpdate, UserRoleEnum, VerificationType } from './types';
import { Mailer } from '../common/mailer/mailer';
import { ApiError, DeprecatedRequestsApiError, ManyRequestsApiError, NotFoundApiError } from 'src/common/error';
import { Template } from 'src/common/template';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import appConfig from '../common/config/app.config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(EmailVerification)
        private emailVerificationRepository: Repository<EmailVerification>,
        @InjectRepository(UserLimits)
        private userLimitsRepository: Repository<UserLimits>,
        private jwt: JwtService,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        if (!email) {
            return null;
        }
        return this.userRepository.findOneBy({ email: email });
    }

    async findByFingerprint(fingerprint: string): Promise<User | null> {
        if (!fingerprint) {
            return null;
        }
        return this.userRepository.findOneBy({ fingerprint: fingerprint });
    }

    async findById(id: number): Promise<User | null> {
        if (!id) {
            return null;
        }
        return this.userRepository.findOneBy({ id: id });
    }

    async add(data: TUserAdd): Promise<User> {
        const userByEmail = await this.findByEmail(data.email);
        if (userByEmail) {
            throw new ApiError('User with the same email address already exist');
        }
        const user = this.userRepository.create(data);
        return await user.save();
    }

    async signup(data: TUserAdd): Promise<User> {
        if (data.email) {
            const userByEmail = await this.findByEmail(data.email);
            if (userByEmail) {
                throw new ApiError('User with the same email address already exist');
            }

            const user = await this.add({
                email: data.email,
                fingerprint: '',
                password: data.password,
                roles: [UserRoleEnum.siteUser],
            });
            return user;
        } else if (data.fingerprint) {
            const userByFingerprint = await this.findByFingerprint(data.fingerprint);
            if (userByFingerprint) {
                throw new ApiError('User with the same fingerprint already exist');
            }
            const user = await this.add({
                email: '',
                password: '',
                fingerprint: data.fingerprint,
                roles: [UserRoleEnum.chromeExtension],
            });
            return user;
        }
    }

    async update(id: number, data: TUserUpdate): Promise<User> {
        const user = await this.findById(id);
        if (!user) {
            throw new NotFoundApiError('Culd not find user by id ' + id);
        }
        if (data.email) {
            user.email = data.email;
        }
        if (data.password) {
            user.password = data.password;
        }
        if (data.roles) {
            user.roles = data.roles;
        }
        return await user.save();
    }

    async remove(id: number): Promise<User> {
        const user = await this.findById(id);
        return await user.remove();
    }

    async ban(id: number, min: number): Promise<void> {
        const user = await this.findById(id);
        if (user) {
            const date = new Date();
            date.setMinutes(date.getMinutes() + min);
            user.banned = date;
            await user.save();
        }
    }

    async getRoleLimit(roles: UserRoleEnum[], query: string): Promise<number> {
        console.log('-----------', roles, query);
        const limits = await this.userLimitsRepository.findBy({ role: In(roles), query: query });
        console.log('+++++', limits);
        if (!limits.length || limits.find((l) => l.value === -1)) {
            return -1;
        }
        return limits.reduce((r, l) => Math.max(l.value, r), 0);
    }

    async createEmailToken(user: User, type: VerificationType): Promise<boolean> {
        let verification = await this.emailVerificationRepository.findOneBy({
            email: user.email,
            type: type,
        });
        if (verification && (new Date().getTime() - verification.createdAt.getTime()) / 60000 < 1) {
            throw new ManyRequestsApiError('The email sent recently');
        }

        if (!verification) {
            verification = this.emailVerificationRepository.create({
                email: user.email,
                type: type,
            });
        }
        //Generate 7 digits number
        verification.token = (Math.floor(Math.random() * 9000000) + 1000000).toString();
        verification.createdAt = new Date();
        await verification.save();
        return true;
    }

    async verifyEmail(token: string): Promise<boolean> {
        let result: { sub: string; token: string };
        try {
            result = this.jwt.verify<{ sub: string; token: string }>(token, {
                secret: appConfig().appSecret,
                ignoreExpiration: true,
            });
        } catch (error) {
            throw new NotFoundApiError('The email token is not valid');
        }
        const verification = await this.emailVerificationRepository.findOneBy({
            token: result.token,
            type: VerificationType.signup,
        });
        if (!verification || !verification.email || verification.email !== result.sub) {
            throw new NotFoundApiError('The email token is not valid');
        }
        if ((new Date().getTime() - verification.createdAt.getTime()) / 60000 >= 1440) {
            throw new DeprecatedRequestsApiError('The email token is deprecated');
        }

        const user = await this.findByEmail(verification.email);
        if (user) {
            user.validEmail = true;
            const savedUser = await user.save();
            await verification.remove();
            return !!savedUser;
        }
        return false;
    }

    async sendEmailVerification(user: User): Promise<boolean> {
        if (user.validEmail) {
            throw new NotFoundApiError('Email address is not registered');
        }
        await this.createEmailToken(user, VerificationType.signup);
        const verification = await this.emailVerificationRepository.findOneBy({
            email: user.email,
            type: VerificationType.signup,
        });

        if (verification && verification.token) {
            const appConf = appConfig();
            const token = this.jwt.sign(
                {
                    sub: verification.email,
                    token: verification.token,
                },
                { secret: appConfig().appSecret },
            );

            const mailer = new Mailer();
            const tmp = new Template('varify.email.template.html', { VERIFYURL: 'https://account.skymetric.kz/verify/' + token, URL: appConf.appHttpUrl });

            return mailer.send(appConf.appEmailAddresser, user.email, 'Подтверждение почты', await tmp.build());
        }
        throw new ApiError('User is not registered by email: ' + user.email);
    }

    async sendEmailResetPassword(user: User): Promise<boolean> {
        await this.createEmailToken(user, VerificationType.resetpassword);
        const verification = await this.emailVerificationRepository.findOneBy({
            email: user.email,
            type: VerificationType.resetpassword,
        });

        if (verification && verification.token) {
            const appConf = appConfig();
            const token = this.jwt.sign(
                {
                    sub: verification.email,
                    token: verification.token,
                },
                { secret: appConfig().appSecret },
            );

            const mailer = new Mailer();
            const tmp = new Template('reset.email.template.html', { RESETURL: 'https://account.skymetric.kz/reset-password/' + token, URL: appConf.appHttpUrl });

            return mailer.send(appConf.appEmailAddresser, user.email, 'Сброс пароля', await tmp.build());
        }
        throw new ApiError('User dont have request to reset password by email: ' + user.email);
    }

    async checkPasswordToken(token: string): Promise<{ email: string; id: number }> {
        let result: { sub: string; token: string };
        try {
            result = this.jwt.verify<{ sub: string; token: string }>(token, {
                secret: appConfig().appSecret,
                ignoreExpiration: true,
            });
        } catch (error) {
            throw new NotFoundApiError('The email token is not valid');
        }

        const verification = await this.emailVerificationRepository.findOneBy({
            token: result.token,
            type: VerificationType.resetpassword,
        });
        if (!verification || !verification.email || verification.email !== result.sub) {
            throw new NotFoundApiError('The email token is not valid');
        }
        if ((new Date().getTime() - verification.createdAt.getTime()) / 60000 >= 1440) {
            throw new DeprecatedRequestsApiError('The email token is deprecated');
        }

        return { email: verification.email, id: verification.id };
    }

    async setPassword({ token, password }: { token: string; password: string }): Promise<boolean> {
        const { email, id } = await this.checkPasswordToken(token);

        const user = await this.findByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            throw new ApiError('The password is same old password');
        }

        if (user) {
            user.password = password;
            const savedUser = await user.save();
            if (savedUser) {
                await this.emailVerificationRepository.delete({
                    id: id,
                });
                const appConf = appConfig();
                const mailer = new Mailer();
                const tmp = new Template('password.email.template.html', { URL: appConf.appHttpUrl });
                await mailer.send(appConf.appEmailAddresser, user.email, 'Пароль изменен', await tmp.build());
            }
            return !!savedUser;
        }
        return false;
    }
}
