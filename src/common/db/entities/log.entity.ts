import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('log')
export class Log extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    query: string;

    @Column()
    userId: number;

    @Column()
    sessionId: number;

    @Column({ type: 'datetime', default: () => 'NOW()' })
    createdAt: Date;
}
