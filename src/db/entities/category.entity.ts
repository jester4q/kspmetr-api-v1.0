import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    BaseEntity,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    level: number;

    @Column()
    parentCategoryId: number;

    @Column({ length: 256 })
    name: string;

    @Column({ length: 512 })
    url: string;

    @Column()
    status: number;

    @ManyToOne((type) => Category, (category) => category.children)
    @JoinColumn({ name: 'parentCategoryId' })
    parent: Category;

    @OneToMany((type) => Category, (category) => category.parent, {})
    @JoinColumn({ name: 'parentCategoryId' })
    children: Category[];
}
