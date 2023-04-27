import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('productsHistory')
export class ProductHistory extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column()
    parsingId: number;

    @Column({ type: 'decimal' })
    unitPrice: number;

    @Column({ type: 'decimal' })
    creditMonthlyPrice: number;

    @Column()
    offersQuantity: number;

    @Column()
    reviewsQuantity: number;

    @Column({ type: 'decimal' })
    productRating: number;

    @Column({ type: 'json' })
    productSellers: { price: number; sellerId: number }[];

    @Column({ type: 'datetime' })
    createdAt: Date;

    @Column()
    sessionId: number;
}
