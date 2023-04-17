import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from 'src/log/logger';
import { Category } from './category.entity';
import { TCategory } from './category.types';

@Injectable()
export class CategoryService {
    private logger = new Logger('category');

    constructor(
        @InjectRepository(Category)
        private categoryRepository: Repository<Category>,
    ) {}

    public async fetchTree(
        parentCategoryId: number,
        depth: number = -1,
    ): Promise<TCategory> {
        try {
            const parent = await this.categoryRepository.findOneBy({
                id: parentCategoryId,
                status: 1,
            });
            if (parent && depth != 0) {
                await this.fetchTreeBranch(parent, depth - 1);
            }
            return this.toCategory(parent);
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async fetchOne(categoryId: number): Promise<TCategory> {
        try {
            const category = await this.categoryRepository.findOneBy({
                id: categoryId,
                status: 1,
            });
            return this.toCategory(category);
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async save(
        parentId: number,
        categories: { name: string; url: string }[],
    ): Promise<boolean> {
        const parent = await this.fetchOne(parentId);
        if (!parent) {
            throw new Error('There is no category with id = ' + parentId);
        }
        try {
            const old = await this.categoryRepository.findBy({
                parentCategoryId: parentId,
            });

            for (let i = 0; i < categories.length; i++) {
                const newItem = categories[i];
                const hasItem = old.find(
                    (oldItem) => newItem.url == oldItem.url,
                );
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
                const hasItem = categories.find(
                    (newItem) => newItem.url == oldItem.url,
                );
                if (!hasItem) {
                    console.log('NOT HAS', oldItem.id);
                    oldItem.status = 0;
                    await oldItem.save();
                }
            }
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
        return false;
    }

    protected toCategory(category: Category): TCategory {
        return {
            id: category.id,
            name: category.name,
            level: category.level,
            parentId: category.parentCategoryId,
            url: category.url,
            children:
                (category.children &&
                    category.children.map((item) => this.toCategory(item))) ||
                [],
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
                promises.push(
                    this.fetchTreeBranch(category.children[i], depth - 1),
                );
            }
            await Promise.all(promises);
        }
    }
}
