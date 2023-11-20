import { PaymentStatusEnum } from 'src/payment/types';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('payments')
export class Payment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    userId: number;

    @Column({ type: 'int' })
    tarifId: number;

    @Column({ type: 'datetime' })
    createdAt: Date;

    @Column({ length: 256 })
    name: string;

    @Column({ type: 'decimal' })
    amount: number;

    @Column({ enum: { enum: PaymentStatusEnum } })
    status: PaymentStatusEnum;
}
