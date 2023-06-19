import { Injectable } from '@nestjs/common';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '../common/log/logger';
import { TCategory } from './category.types';
import { Category } from '../common/db/entities';
import { TCategoryPath } from 'src/product/product.types';
import { ApiError } from '../common/error';

@Injectable()
export class CategoryService {
    private logger = new Logger('category');

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
        private dataSource: DataSource,
    ) {}

    public async fetchTree(parentCategoryId: number, depth: number = -1): Promise<TCategory> {
        const parent = await this.categoryRepository.findOneBy({
            id: parentCategoryId,
            status: 1,
        });
        if (!parent) {
            throw new Error('There is no category with id = ' + parentCategoryId);
        }
        if (depth != 0) {
            await this.fetchTreeBranch(parent, depth - 1);
        }
        return this.toCategory(parent);
    }

    public async fetchOne(categoryId: number): Promise<TCategory> {
        const category = await this.categoryRepository.findOneByOrFail({
            id: categoryId,
            status: 1,
        });
        return this.toCategory(category);
    }

    public async save(parentId: number, categories: { name: string; url: string }[]): Promise<boolean> {
        const parent = await this.categoryRepository.findOneBy({
            id: parentId,
        });
        if (!parent) {
            throw new ApiError('There is no category with id = ' + parentId);
        }

        if (!categories || !categories.length) {
            await this.setStatusToTree(parent, false, true);
            return true;
        }

        const old = await this.categoryRepository.findBy({
            parentCategoryId: parentId,
        });

        for (let i = 0; i < categories.length; i++) {
            const newItem = categories[i];
            const hasItem = old.find((oldItem) => newItem.url == oldItem.url);
            if (hasItem && hasItem.name != newItem.name) {
                hasItem.name = newItem.name;
                hasItem.status = 1;
                await hasItem.save();
            }
            if (!hasItem) {
                const category = this.categoryRepository.create({
                    parentCategoryId: parentId,
                    level: parent.level + 1,
                    name: newItem.name,
                    url: newItem.url,
                    status: 1,
                });
                await category.save();
            }
        }

        for (let i = 0; i < old.length; i++) {
            const oldItem = old[i];
            const hasItem = categories.find((newItem) => newItem.url == oldItem.url);
            if (!hasItem) {
                await this.setStatusToTree(oldItem, false);
            }
        }

        return false;
    }

    public async checkPath(path: number[]): Promise<boolean> {
        const categories = await this.categoryRepository.createQueryBuilder().where('`Category`.id in (:...ids)', { ids: path }).getMany();
        if (path.length !== categories.length) {
            return false;
        }
        let failed = false;
        for (let i = path.length - 1; !failed && i >= 0; i--) {
            const x = path[i];
            const category = categories.find((cat) => cat.id == x);
            if (!category || (i > 0 && category.parentCategoryId != path[i - 1])) {
                failed = true;
            }
        }
        return !failed;
    }

    public async addPath(path: { level1: string; level2: string; level3?: string; level4?: string }): Promise<TCategoryPath> {
        const way = [path.level1, path.level2, path.level3, path.level4].filter((x) => x && x.length > 0);
        const result: TCategoryPath = { level1: 0, level2: 0 };
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();
            let parentId = 0;
            for (let i = 0; i < way.length; i++) {
                const cat = await this.addCategory(i + 1, way[i], parentId, queryRunner);
                result['level' + (i + 1)] = cat.id;
                parentId = cat.id;
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }

        return result;
    }

    protected async addCategory(level: number, name: string, parentId: number, runner: QueryRunner): Promise<Category> {
        let cat = await this.categoryRepository.createQueryBuilder().where('`Category`.name like :name', { name: name }).andWhere('level = :n', { n: level }).getOne();

        if (cat) {
            if (cat.parentCategoryId == parentId && cat.level === level) {
                return cat;
            }

            throw new Error('Could not create category with name "${name}"');
        }
        cat = this.categoryRepository.create({
            parentCategoryId: parentId,
            name: name,
            level: level,
            url: '',
            status: 1,
        });
        await runner.manager.save(cat);
        return cat;
    }

    protected toCategory(category: Category): TCategory {
        return {
            id: category.id,
            name: category.name,
            level: category.level,
            parentId: category.parentCategoryId,
            url: category.url,
            children: (category.children && category.children.map((item) => this.toCategory(item))) || [],
        };
    }

    protected async fetchTreeBranch(category: Category, depth: number) {
        category.children = await this.categoryRepository.findBy({
            parentCategoryId: category.id,
            status: 1,
        });
        if (category.children && category.children.length && depth) {
            const promises = [];
            for (let i = 0; i < category.children.length; i++) {
                promises.push(this.fetchTreeBranch(category.children[i], depth - 1));
            }
            await Promise.all(promises);
        }
    }

    protected async setStatusToTree(category: Category, status: boolean, exclude: boolean = false) {
        const children = await this.categoryRepository.findBy({
            parentCategoryId: category.id,
            status: status ? 0 : 1,
        });
        if (!exclude) {
            category.status = status ? 1 : 0;
        }
        await category.save();
        if (children && children.length) {
            const promises = [];
            for (let i = 0; i < children.length; i++) {
                promises.push(this.setStatusToTree(children[i], status));
            }
            await Promise.all(promises);
        }
    }
}
