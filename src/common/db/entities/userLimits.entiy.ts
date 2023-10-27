import { UserRoleEnum } from 'src/user/types';
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';

@Entity('userLimits')
export class UserLimits extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    query: string;

    @Column()
    role: UserRoleEnum;

    @Column()
    value: number;
}
