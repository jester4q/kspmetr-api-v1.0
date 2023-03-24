import { json } from 'stream/consumers';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('products')
export class Product extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 12 })
    code: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 255 })
    url: string;

    @Column()
    unitPrice: number;

    @Column()
    creditMonthlyPrice: number;

    @Column()
    offersQuantity: number;

    @Column()
    reviewsQuantity: number;

    @Column()
    description: string;

    @Column({ type: 'json' })
    specification: { name: string; value: string }[];

    @Column({ type: 'json' })
    galleryImages: { lage: string; medium: string; small: string }[];

    @Column({ type: 'datetime' })
    lastCheckedAt: Date;

    @Column()
    productRating: number;

    @Column()
    status: number;

    @Column()
    failDescription: string;

    @Column({ type: 'datetime' })
    failDate: Date;

    @Column()
    attempt: number;

    @Column({ type: 'json' })
    categories: { level1: number; level2: number; level3: number };

    @Column()
    categoryId: number;
}
