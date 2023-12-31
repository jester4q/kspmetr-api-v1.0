import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert, CreateDateColumn, BaseEntity, OneToMany, BeforeUpdate } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../../../user/types';
import { AuthSession } from './authSession.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    fingerprint: string;

    @Column()
    password: string;

    @Column('set', { enum: UserRoleEnum })
    roles: UserRoleEnum[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @CreateDateColumn({ type: 'datetime' })
    banned: Date;

    @Column({ type: 'boolean' })
    validEmail: boolean;

    @OneToMany(() => AuthSession, (session) => session.user)
    sessions: AuthSession[];

    @BeforeInsert()
    @BeforeUpdate()
    async setPassword(password: string) {
        const value = password || this.password;
        if (value) {
            const salt = await bcrypt.genSalt();
            this.password = await bcrypt.hash(value, salt);
        }
    }
}
