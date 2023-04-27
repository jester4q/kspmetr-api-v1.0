import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BeforeInsert,
    CreateDateColumn,
    BaseEntity,
    OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../../user/types';
import { AuthSession } from './authSession.entity';

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column('set', { enum: UserRoleEnum })
    roles: UserRoleEnum[];

    @CreateDateColumn({ type: 'datetime' })
    createdAt: Date;

    @CreateDateColumn({ type: 'datetime' })
    banned: Date;

    @OneToMany(() => AuthSession, (session) => session.user)
    sessions: AuthSession[];

    @BeforeInsert()
    async setPassword(password: string) {
        const salt = await bcrypt.genSalt();
        this.password = await bcrypt.hash(password || this.password, salt);
    }
}
