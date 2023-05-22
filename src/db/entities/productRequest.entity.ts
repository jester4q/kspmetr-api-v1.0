import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('productsRequests')
export class ProductRequest extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    sessionId: number;

    @Column({ length: 12 })
    code: string;

    @Column({ length: 512 })
    url: string;

    @Column()
    status: number;

    @Column()
    errorDescription: string;
}
