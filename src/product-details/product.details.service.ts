import { Injectable } from '@nestjs/common';
import { Between, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../common/db/entities/product.entity';
import { ProductHistory } from '../common/db/entities/productHistory.entity';
import { dateToStr } from '../utils';

export enum DataTypesEnum {
    prices = 'prices',
    reviews = 'reviews',
    sellers = 'sellers',
    rating = 'rating',
}

export enum ModeEnum {
    values = 'values',
    dates = 'dates',
}

export type TDataType = 'prices' | 'rating' | 'reviews' | 'sellers';

export type TProductStatItem = { [key: string]: string };

export type TProductStat = {
    prices?: TProductStatItem;
    reviews?: TProductStatItem;
    ratings?: TProductStatItem;
    sellers?: TProductStatItem;
};

@Injectable()
export class ProductDetailsService {
    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductHistory)
        private historyRepository: Repository<ProductHistory>,
    ) {}

    public async fetchOne(code: string): Promise<Product | null> {
        const product = await this.productRepository.findOneBy({
            code: code,
        });
        return product;
    }

    public async fetchStatByDates(
        productId: number,
        period: number,
        types: DataTypesEnum[],
    ): Promise<TProductStat> {
        const date = new Date();
        const from = new Date();
        from.setDate(date.getDate() - period);
        from.setHours(0);
        from.setMinutes(0);
        from.setSeconds(0);
        const to = new Date();
        to.setDate(date.getDate() - 1);
        to.setHours(23);
        to.setMinutes(59);
        to.setSeconds(59);

        const history = await this.historyRepository.find({
            where: { productId: productId, createdAt: Between(from, to) },
            order: { createdAt: 'DESC' }, // last got price in day
        });
        const result: TProductStat = {};
        for (let i = period; i >= 1; i--) {
            const currentDate = new Date();
            currentDate.setDate(date.getDate() - i);
            const current = dateToStr(currentDate);
            const item = history.find(
                (x) => dateToStr(x.createdAt) === current,
            );
            if (types.includes(DataTypesEnum.prices)) {
                if (!result.prices) {
                    result.prices = {};
                }
                result.prices[current] = '' + ((item && item.unitPrice) || '');
            }
            if (types.includes(DataTypesEnum.rating)) {
                if (!result.ratings) {
                    result.ratings = {};
                }
                result.ratings[current] =
                    '' + ((item && item.productRating) || '');
            }
            if (types.includes(DataTypesEnum.reviews)) {
                if (!result.reviews) {
                    result.reviews = {};
                }
                result.reviews[current] =
                    '' + ((item && item.reviewsQuantity) || '');
            }
            if (types.includes(DataTypesEnum.sellers)) {
                if (!result.sellers) {
                    result.sellers = {};
                }
                result.sellers[current] =
                    '' +
                    ((item &&
                        item.productSellers &&
                        item.productSellers.length) ||
                        '');
            }
        }

        return result;
    }

    public async fetchStatByValues(
        productId: number,
        period: number,
        types: DataTypesEnum[],
    ): Promise<TProductStat> {
        const history = await this.historyRepository.find({
            where: { productId: productId },
            order: { createdAt: 'DESC' },
            take: period,
        });
        const result: TProductStat = {};
        history.forEach((item) => {
            const date = item.createdAt.toISOString().split('T')[0];
            if (types.includes(DataTypesEnum.prices)) {
                if (!result.prices) {
                    result.prices = {};
                }
                result.prices[date] = '' + item.unitPrice;
            }
            if (types.includes(DataTypesEnum.rating)) {
                if (!result.ratings) {
                    result.ratings = {};
                }
                result.ratings[date] = '' + item.productRating;
            }
            if (types.includes(DataTypesEnum.reviews)) {
                if (!result.reviews) {
                    result.reviews = {};
                }
                result.reviews[date] = '' + item.reviewsQuantity;
            }
            if (types.includes(DataTypesEnum.sellers)) {
                if (!result.sellers) {
                    result.sellers = {};
                }
                result.sellers[date] =
                    '' +
                    ((item.productSellers && item.productSellers.length) || 0);
            }
        });

        return result;
    }
}
