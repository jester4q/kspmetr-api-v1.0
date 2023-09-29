import { TCategoryPath, TProductImage, TProductSpecification } from '../../../product/product.types';
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

    @Column({ type: 'decimal' })
    unitPrice: number;

    @Column({ type: 'decimal' })
    creditMonthlyPrice: number;

    @Column({ type: 'int' })
    offersQuantity: number;

    @Column({ type: 'int' })
    reviewsQuantity: number;

    @Column({ type: 'int' })
    ratingQuantity: number;

    @Column()
    description: string;

    @Column({ type: 'json' })
    specification: TProductSpecification[];

    @Column({ type: 'json' })
    galleryImages: TProductImage[];

    @Column({ type: 'datetime' })
    lastCheckedAt: Date;

    @Column({ type: 'datetime' })
    lastSeeAt: Date;

    @Column({ type: 'decimal' })
    productRating: number;

    @Column()
    status: number;

    @Column({ type: 'text' })
    failDescription: string;

    @Column({ type: 'datetime' })
    failDate: Date | null;

    @Column()
    attempt: number;

    @Column({ type: 'json' })
    categories: TCategoryPath;

    @Column()
    categoryId: number;

    @Column()
    sessionId: number;

    @Column()
    position: number;

    @Column()
    collectingId: number;
}
