import { VerificationType } from 'src/user/types';
import { Entity, Column, BaseEntity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('emailVerifications')
export class EmailVerification extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    token: string;

    @Column({ type: 'datetime', default: () => 'NOW()' })
    createdAt: Date;

    @Column('set', { enum: VerificationType })
    type: VerificationType;
}
