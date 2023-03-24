import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('authTokens')
export class AuthToken extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    token: string;

    @Column()
    name: string;

    @Column({ default: () => true })
    active: boolean;

    @Column({ type: 'datetime' })
    lastAcessDate: Date;
}
