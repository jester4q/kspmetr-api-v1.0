import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('productsReviews')
export class ProductReview extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column()
    productCode: string;

    @Column({ length: 256 })
    author: string;

    @Column()
    rating: number;

    @Column({ length: 64 })
    externalId: string;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    sessionId: number;
}
