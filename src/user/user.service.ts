import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities';
import { TUserAdd, TUserUpdate, UserRoleEnum } from './types';
import { Logger } from '../log/logger';

@Injectable()
export class UserService {
    private logger = new Logger('user');

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
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
        try {
            const user = this.userRepository.create(data);
            return await user.save();
        } catch (error) {
            this.logger.log(error);
            throw new Error('Could not add user');
        }
    }

    async signup(data: TUserAdd): Promise<User> {
        const userByEmail = await this.findByEmail(data.email);
        const userByFingerprint = await this.findByFingerprint(
            data.fingerprint,
        );

        if (data.email) {
            console.log(1);
            if (userByEmail) {
                throw new Error(
                    'User with the same email address already exist',
                );
            }
            console.log(2, userByFingerprint);
            if (userByFingerprint && !userByFingerprint.email) {
                console.log(3);
                userByFingerprint.email = data.email;
                userByFingerprint.password = data.password;
                try {
                    await userByFingerprint.save();
                } catch (error) {
                    console.log(error);
                    this.logger.log(error);
                    throw new Error('Could not signup user');
                }
                return userByFingerprint;
            }
            console.log(4);
            try {
                const user = await this.add({
                    email: data.email,
                    fingerprint: userByFingerprint
                        ? undefined
                        : data.fingerprint || undefined,
                    password: data.password,
                    roles: [UserRoleEnum.chromeExtension],
                });
                return user;
            } catch (error) {
                console.log(error);
                this.logger.log(error);
                throw new Error('Could not signup user by email');
            }
        } else if (data.fingerprint) {
            if (userByFingerprint) {
                throw new Error('User with the same fingerprint already exist');
            }
            try {
                const user = await this.add({
                    email: undefined,
                    password: undefined,
                    fingerprint: data.fingerprint,
                    roles: [UserRoleEnum.chromeExtension],
                });
                return user;
            } catch (error) {
                console.log(error);
                this.logger.log(error);
                throw new Error('Could not signup user by fingerprint');
            }
        }
    }

    async update(id: number, data: TUserUpdate): Promise<User> {
        const user = await this.findById(id);
        if (data.email) {
            user.email = data.email;
        }
        if (data.password) {
            user.password = data.password;
        }
        if (data.roles) {
            user.roles = data.roles;
        }
        try {
            return await user.save();
        } catch (error) {
            this.logger.log(error);
            throw new Error('Could not update user');
        }
    }

    async remove(id: number): Promise<User> {
        const user = await this.findById(id);
        try {
            return await user.remove();
        } catch (error) {
            this.logger.log(error);
            throw new Error('Could not remove user');
        }
    }

    async ban(id: number, min: number): Promise<void> {
        const user = await this.findById(id);
        if (user) {
            try {
                const date = new Date();
                date.setMinutes(date.getMinutes() + min);
                user.banned = date;
                await user.save();
            } catch (error) {
                this.logger.log(error);
                throw new Error('Could not update user');
            }
        }
    }
}
