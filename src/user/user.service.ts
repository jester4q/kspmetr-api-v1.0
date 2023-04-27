import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../db/entities';
import { TUserAdd, TUserUpdate } from './types';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {}

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOneBy({ email: email });
    }

    async findById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id: id });
    }

    async add(data: TUserAdd): Promise<User> {
        try {
            const user = this.userRepository.create(data);
            return await user.save();
        } catch (error) {
            throw error;
        }
    }

    async upate(id: number, data: TUserUpdate): Promise<User> {
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
        return await user.save();
    }

    async remove(id: number): Promise<User> {
        const user = await this.findById(id);
        return await user.remove();
    }

    async ban(id, min: number): Promise<void> {
        const user = await this.findById(id);
        if (user) {
            const date = new Date();
            date.setMinutes(date.getMinutes() + min);
            user.banned = date;
            await user.save();
        }
    }
}
