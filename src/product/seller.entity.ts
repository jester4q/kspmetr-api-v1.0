import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('sellers')
export class Seller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    code: string;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 256 })
    url: string;

    @Column({ type: 'datetime' })
    createdAt: Date;
}

@Entity('productsToSellers')
export class ProductToSeller extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    productId: number;

    @Column()
    sellerId: number;
}
