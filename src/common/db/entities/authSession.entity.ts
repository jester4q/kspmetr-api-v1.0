import { User } from './user.entity';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
} from 'typeorm';

@Entity('authSessions')
export class AuthSession extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    token: string;

    @Column()
    userId: number;

    @Column({ default: () => true })
    active: boolean;

    @Column({ type: 'datetime', default: () => 'NOW()' })
    createdAt: Date;

    @Column({ type: 'datetime', default: () => 'NOW()+INTERVAL 1 MONTH' })
    expiredAt: Date;

    @ManyToOne(() => User, (user) => user.sessions)
    user: User;
}
