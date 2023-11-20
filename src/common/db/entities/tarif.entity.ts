import { UserRoleEnum } from 'src/user/types';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('tarifs')
export class Tarif extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('enum', { enum: UserRoleEnum })
    role: UserRoleEnum;

    @Column({ length: 256 })
    name: string;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'tinyint' })
    months: number;

    @Column({ type: 'tinyint' })
    status: number;
}
