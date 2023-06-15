import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmailVerification, User } from '../common/db/entities';
import { TUserAdd, TUserUpdate, UserRoleEnum } from './types';
import { Mailer } from '../common/mailer/mailer';
import { ApiError, DeprecatedRequestsApiError, ManyRequestsApiError, NotFoundApiError } from 'src/common/error';
import { Template } from 'src/common/template';
import { JwtService } from '@nestjs/jwt';

import appConfig from '../common/config/app.config';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(EmailVerification)
        private emailVerificationRepository: Repository<EmailVerification>,
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
        const userByEmail = await this.findByEmail(data.email);
        const userByFingerprint = await this.findByFingerprint(data.fingerprint);

        if (data.email) {
            if (userByEmail) {
                throw new ApiError('User with the same email address already exist');
            }
            if (userByFingerprint && !userByFingerprint.email) {
                userByFingerprint.email = data.email;
                userByFingerprint.password = data.password;
                await userByFingerprint.save();
                return userByFingerprint;
            }
            const user = await this.add({
                email: data.email,
                fingerprint: userByFingerprint ? undefined : data.fingerprint || undefined,
                password: data.password,
                roles: [UserRoleEnum.chromeExtension],
            });
            return user;
        } else if (data.fingerprint) {
            if (userByFingerprint) {
                throw new ApiError('User with the same fingerprint already exist');
            }
            const user = await this.add({
                email: undefined,
                password: undefined,
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

    async createEmailToken(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        if (!user || user.validEmail) {
            throw new NotFoundApiError('Email address is not registered');
        }
        let verification = await this.emailVerificationRepository.findOneBy({
            email: email,
        });
        if (verification && (new Date().getTime() - verification.createdAt.getTime()) / 60000 < 1) {
            throw new ManyRequestsApiError('The email sent recently');
        }

        if (!verification) {
            verification = this.emailVerificationRepository.create({
                email: email,
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

    async sendEmailVerification(email: string): Promise<boolean> {
        const verification = await this.emailVerificationRepository.findOneBy({
            email: email,
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
            const tmp = new Template('varify.email.template.html', { VERIFYURL: appConf.appHttpUrl + 'auth/email/verify/' + token, URL: appConf.appHttpUrl });

            return mailer.send(appConf.appEmailAddresser, email, 'Подтверждение почты', await tmp.build());
        }
        throw new ApiError('User is not registered by email: ' + email);
    }
}
