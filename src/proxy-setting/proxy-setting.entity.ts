import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { ProxySettingDTO } from './proxy-setting.dto';

@Entity('proxy')
export class ProxySetting extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 16 })
    ip: string;

    @Column({ length: 5 })
    port: string;

    @Column({ length: 100 })
    username: string;

    @Column({ length: 100 })
    pwd: string;

    @Column({ length: 10 })
    type: string;

    @Column()
    status: number;

    @Column({ type: 'text' })
    failDescription: string;

    @Column({ type: 'datetime' })
    failDate: Date;
}
