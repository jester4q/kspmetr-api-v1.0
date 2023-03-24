import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductHistory } from './entities/productHistory.entity';

export enum DataTypesEnum {
    prices = 'prices',
    reviews = 'reviews',
    sellers = 'sellers',
    rating = 'rating',
}

export type TDataType = 'prices' | 'rating' | 'reviews' | 'sellers';

export type TProductStatItem = { [key: string]: number };

export type TProductStat = {
    prices?: TProductStatItem;
    reviews?: TProductStatItem;
    ratings?: TProductStatItem;
    sellers?: TProductStatItem;
};

@Injectable()
export class ProductService {
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

    public async fetchStat(
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
                result.prices[date] = item.unitPrice;
            }
            if (types.includes(DataTypesEnum.rating)) {
                if (!result.ratings) {
                    result.ratings = {};
                }
                result.ratings[date] = item.productRating;
            }
            if (types.includes(DataTypesEnum.reviews)) {
                if (!result.reviews) {
                    result.reviews = {};
                }
                result.reviews[date] = item.reviewsQuantity;
            }
            if (types.includes(DataTypesEnum.sellers)) {
                if (!result.sellers) {
                    result.sellers = {};
                }
                result.sellers[date] = item.productSellers.length;
            }
        });

        return result;
    }
}
