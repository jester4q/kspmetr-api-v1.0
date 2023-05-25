import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TCategoryProduct, TProduct } from './product.types';
import { Logger } from 'src/log/logger';
import {
    AddDetailedProductModel,
    AddProductModel,
    IAddDetailedProductModel,
    IAddProductModel,
    IProductModel,
    ProductModel,
} from './product.model';
import {
    Product,
    ProductHistory,
    ProductReview,
    ProductToSeller,
    Seller,
} from '../db/entities';
import { TSessionUser } from 'src/auth/token/authToken.service';
import { CategoryService } from 'src/category/category.service';

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
    private logger = new Logger('product');

    constructor(
        @InjectRepository(Product)
        private productRepository: Repository<Product>,
        @InjectRepository(ProductHistory)
        private historyRepository: Repository<ProductHistory>,
        @InjectRepository(ProductReview)
        private reviewRepository: Repository<ProductReview>,
        @InjectRepository(Seller)
        private sellerRepository: Repository<Seller>,
        @InjectRepository(ProductToSeller)
        private productToSellerRepository: Repository<ProductToSeller>,
        private categoryService: CategoryService,
    ) {}

    public async fetchOne(id: number): Promise<TProduct> {
        try {
            const product = await this.productRepository.findOneBy({
                id: id,
            });
            return this.toProduct(product);
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async fetchAllInCategory(
        categoryIds: number[],
        reverse: boolean = false,
    ): Promise<TCategoryProduct[]> {
        try {
            const products1 = await this.productRepository
                .createQueryBuilder()
                .where('`Product`.categoryId in (:...ids)', {
                    ids: categoryIds,
                })
                .andWhere('(`Product`.status=1 OR `Product`.attempt < 4)')
                .andWhere('`Product`.lastCheckedAt IS NOT NULL')
                .orderBy('`Product`.lastCheckedAt', reverse ? 'DESC' : 'ASC')
                .getMany();
            const products2 = await this.productRepository
                .createQueryBuilder()
                .where('`Product`.categoryId in (:...ids)', {
                    ids: categoryIds,
                })
                .andWhere('(`Product`.status=1 OR `Product`.attempt < 4)')
                .andWhere('`Product`.lastCheckedAt IS NULL')
                .orderBy('`Product`.id', reverse ? 'DESC' : 'ASC')
                .getMany();
            return (
                reverse
                    ? [...products2, ...products1]
                    : [...products1, ...products2]
            ).map((item) => this.toCategoryProduct(item));
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }
    }

    public async addAndUpdate(
        session: TSessionUser,
        model: IAddDetailedProductModel,
    ) {
        if (!model.isValid()) {
            throw new Error('Culd not add/update product by this data');
        }

        const categoryPath = await this.categoryService.addPath(
            model.categoryName,
        );
        model.setCategories(categoryPath);
        const product = await this.productRepository.findOneBy({
            code: model.code,
        });
        const newProduct = await this.add(session, model);
        if (!model.id) {
            model.setId(newProduct.id);
        }

        return this.save(session, model.id, model);
    }

    public async add(
        session: TSessionUser,
        source: IAddProductModel,
    ): Promise<TProduct> {
        if (!source.isValid()) {
            throw new Error('Culd not add product by this data');
        }

        let product = await this.productRepository.findOneBy({
            code: source.code,
        });
        if (product) {
            product.title = source.title || product.title;
            product.url = source.url || product.url;

            product.categories = source.cartegoryPath || product.categories;
            product.categoryId = source.categoryId || product.categoryId;
            product.position = source.position;
        } else {
            product = this.productRepository.create({
                code: source.code,
                title: source.title,
                url: source.url,
                categoryId: source.categoryId,
                categories: source.cartegoryPath,
                sessionId: session.sessionId,
                position: source.position,
            });
        }
        await product.save();
        return this.toProduct(product);
    }

    public async save(
        session: TSessionUser,
        productId: number,
        source: IProductModel,
    ): Promise<TProduct> {
        if (!source.isValid()) {
            throw new Error('Culd not save product data');
        }
        let product;
        try {
            product = await this.productRepository.findOneBy({
                id: productId,
            });
        } catch (error) {
            this.logger.log(JSON.stringify(error));
            throw error;
        }

        if (source.isNotFound) {
            try {
                await this.markProductAsFail(product, source.getErrorMessage);
            } catch (error) {
                this.logger.log(JSON.stringify(error));
                throw error;
            }
            return;
        }

        product.lastCheckedAt = new Date();
        product.status = 1;
        product.failDate = null;
        product.failDescription = '';
        product.attempt = 0;

        const history: Partial<ProductHistory> = {
            productId: productId,
            parsingId: source.parsingId,
            sessionId: session.sessionId,
        };

        if (source.reviews && !source.hasReviewsError) {
            let rating;
            try {
                rating = await this.saveReviews(session, source, productId);
            } catch (error) {
                this.logger.log('saveReviews: ' + JSON.stringify(error));
                throw error;
            }
            product.productRating = rating;
            history.productRating = rating;
        }
        if (source.description && !source.hasDescriptionError) {
            product.description = source.description;
        }
        if (source.sellers && !source.hasSellersError) {
            let sellers;
            try {
                sellers = await this.saveSeller(session, source, productId);
            } catch (error) {
                this.logger.log('saveSeller: ' + JSON.stringify(error));
                throw error;
            }
            history.productSellers = sellers;
        }
        if (product.unitPrice !== undefined) {
            product.unitPrice = source.unitPrice;
            history.unitPrice = source.unitPrice;
        }
        if (product.creditMonthlyPrice !== undefined) {
            product.creditMonthlyPrice = source.creditMonthlyPrice;
            history.creditMonthlyPrice = source.creditMonthlyPrice;
        }
        if (product.offersQuantity !== undefined) {
            product.offersQuantity = source.offersQuantity;
            history.offersQuantity = source.offersQuantity;
        }

        if (!source.hasDetalsError) {
            if (source.galleryImages) {
                product.galleryImages = source.galleryImages;
            }
            if (source.reviewsQuantity !== undefined) {
                product.reviewsQuantity = source.reviewsQuantity;
                history.reviewsQuantity = source.reviewsQuantity;
            }
        }
        if (
            source.specification !== undefined &&
            !source.hasSpecificationError
        ) {
            product.specification = source.specification;
        }
        try {
            await product.save();
        } catch (error) {
            this.logger.log('Save product ' + JSON.stringify(error));
            throw error;
        }

        try {
            await this.historyRepository.save(history);
        } catch (error) {
            this.logger.log('Save history ' + JSON.stringify(error));
            throw error;
        }

        return this.toProduct(product);
    }

    private async saveSeller(
        session: TSessionUser,
        product: IProductModel,
        productId: number,
    ): Promise<{ sellerId: number; price: number }[]> {
        const sellers = product.sellers;
        if (!sellers.length) {
            return [];
        }
        const result: { sellerId: number; price: number }[] = [];
        const toInsert: {
            [key: string]: { code: string; name: string; url: string };
        } = {};
        const toSelect = [];
        const codeAndPrice = {};
        sellers.forEach((item) => {
            toInsert[item.id] = {
                code: item.id,
                name: item.name,
                url: item.url,
            };
            toSelect.push(item.id);
            codeAndPrice[item.id] = item.price;
        });
        const items = await this.sellerRepository
            .createQueryBuilder()
            .where('code IN(:...ids)', { ids: toSelect })
            .getMany();
        const itemsByCode: Seller[] = [];
        items.forEach((item) => {
            itemsByCode[item.code] = item;
        });
        for (let code in toInsert) {
            if (!toInsert.hasOwnProperty(code)) {
                continue;
            }

            const item = toInsert[code];
            if (itemsByCode[code] !== undefined) {
                const oldItem: Seller = itemsByCode[code];
                if (item.name != oldItem.name || item.url != oldItem.url) {
                    oldItem.name = item.name;
                    oldItem.url = item.url;
                    await oldItem.save();
                }
            } else {
                const newItem = this.sellerRepository.create(item);
                newItem.sessionId = session.sessionId;
                await newItem.save();
                items.push(newItem);
            }
        }
        const sellersId: number[] = [];
        items.forEach((item) => {
            result.push({ sellerId: item.id, price: codeAndPrice[item.code] });
            sellersId.push(item.id);
        });

        const productToSellers = await this.productToSellerRepository.findBy({
            productId: productId,
        });

        const forDelete = [];
        const forAdd = [];
        const hasIds = [];
        productToSellers.forEach((item) => {
            hasIds.push(item.sellerId);
            if (sellersId.indexOf(item.sellerId) === -1) {
                forDelete.push(item.id);
            }
        });

        sellersId.forEach((id) => {
            if (hasIds.indexOf(id) === -1) {
                forAdd.push(id);
            }
        });
        if (forDelete.length) {
            await this.productToSellerRepository.delete(forDelete);
        }
        if (forAdd.length) {
            await this.productToSellerRepository
                .createQueryBuilder()
                .insert()
                .into(this.productToSellerRepository.target)
                .values(
                    forAdd.map((id) => ({
                        productId: productId,
                        sellerId: id,
                    })),
                )
                .orIgnore()
                .execute();
        }

        return result;
    }

    private async saveReviews(
        session: TSessionUser,
        product: IProductModel,
        productId: number,
    ): Promise<number> {
        if (product.reviews.length) {
            const productCode = product.code;
            const reviews = product.reviews.map((review) => ({
                productId: productId,
                productCode: productCode,
                author: review.author,
                date: review.date,
                rating: review.rating,
                externalId: review.id,
                sessionId: session.sessionId,
            }));
            await this.reviewRepository
                .createQueryBuilder()
                .insert()
                .into(this.reviewRepository.target)
                .values(reviews)
                .orIgnore()
                .execute();
        }
        const result = await this.reviewRepository.average('rating', {
            productId: productId,
        });
        return result || 0;
    }

    private async markProductAsFail(product: Product, reason: string) {
        product.status = 0;
        product.failDate = new Date();
        product.failDescription = reason;
        product.attempt = product.attempt + 1;
        await product.save();
    }

    protected toProduct(product: Product): TProduct {
        return {
            id: product.id,
            title: product.title,
            code: product.code,
            creditMonthlyPrice: product.creditMonthlyPrice,
            description: product.description,
            galleryImages: product.galleryImages,
            lastCheckedAt: product.lastCheckedAt,
            offersQuantity: product.offersQuantity,
            productRating: product.productRating,
            reviewsQuantity: product.reviewsQuantity,
            specification: product.specification,
            unitPrice: product.unitPrice,
            url: product.url,
        };
    }

    private toCategoryProduct(product: Product): TCategoryProduct {
        return {
            id: product.id,
            title: product.title,
            code: product.code,
            url: product.url,
        };
    }
}
