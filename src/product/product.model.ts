import { AddDetailedProductRequestDTO } from './add.detailed.product.dto';
import { AddProductRequestDTO } from './add.product.dto';
import {
    TCategoryName,
    TCategoryPath,
    TProductImage,
    TProductReview,
    TProductSeller,
    TProductSpecification,
} from './product.types';
import { SaveProductRequestDTO } from './save.product.dto';
import { ProductCategoryPathDto } from './product.dto';
import { isNumber, isArray, isString, strToDate } from '../utils';

export interface IAddProductModel {
    url: string;

    code: string;

    title: string;

    cartegoryPath: TCategoryPath;

    categoryId: number;

    isValid(): boolean;
}

export interface IProductModel {
    id: number;

    code: string;

    parsingId: number;

    title: string;

    url: string;

    unitPrice: number | undefined;

    creditMonthlyPrice: number | undefined;

    rating: number | undefined;

    galleryImages: TProductImage[] | undefined;

    reviewsQuantity: number | undefined;

    offersQuantity: number | undefined;

    specification: TProductSpecification[] | undefined;

    description: string | undefined;

    sellers: TProductSeller[] | undefined;

    reviews: TProductReview[] | undefined;

    hasDetalsError: boolean;

    hasSpecificationError: boolean;

    hasDescriptionError: boolean;

    hasSellersError: boolean;

    hasReviewsError: boolean;

    hasErrors: boolean;

    getErrorMessage: string | undefined;

    isNotFound: boolean;

    isValid(): boolean;
}

export interface IAddDetailedProductModel
    extends IAddProductModel,
        IProductModel {
    setId(id: number): void;

    setCategories(path: TCategoryPath): void;

    categoryName: TCategoryName;

    isValid(): boolean;
}

export class ProductModel implements IProductModel {
    constructor(protected data: SaveProductRequestDTO) {}

    public get id(): number {
        if (!isNumber(this.data.id)) {
            this.data.id = 0;
        }
        if (typeof this.data.id === 'string') {
            this.data.id = parseInt(this.data.id);
        }
        return this.data.id;
    }

    public get code(): string {
        if (!isString(this.data.code) && !isNumber(this.data.code)) {
            this.data.code = '';
        }
        return String(this.data.code).toString();
    }

    public get parsingId(): number {
        if (!isNumber(this.data.parsingId)) {
            this.data.parsingId = 0;
        }

        if (typeof this.data.parsingId === 'string') {
            this.data.parsingId = parseInt(this.data.parsingId);
        }
        return this.data.parsingId;
    }

    public get title(): string {
        if (!isString(this.data.title)) {
            this.data.title = '';
        }
        return this.data.title;
    }

    public isValid(): boolean {
        return !!this.code && !!this.url;
    }

    public get unitPrice(): number | undefined {
        if (!isNumber(this.data.unitPrice)) {
            return undefined;
        }
        if (typeof this.data.unitPrice === 'string') {
            this.data.unitPrice = parseFloat(this.data.unitPrice);
        }
        return this.data.unitPrice;
    }

    public get creditMonthlyPrice(): number | undefined {
        if (!isNumber(this.data.creditMonthlyPrice)) {
            return undefined;
        }
        if (typeof this.data.creditMonthlyPrice === 'string') {
            this.data.creditMonthlyPrice = parseFloat(
                this.data.creditMonthlyPrice,
            );
        }
        return this.data.creditMonthlyPrice;
    }

    public get rating(): number | undefined {
        if (!isNumber(this.data.rating)) {
            return undefined;
        }
        if (typeof this.data.rating === 'string') {
            this.data.rating = parseFloat(this.data.rating);
        }
        return this.data.rating;
    }

    public get url(): string {
        if (!isString(this.data.url)) {
            this.data.url = '';
        }
        return this.data.url;
    }

    public get galleryImages(): TProductImage[] | undefined {
        if (!Array.isArray(this.data.galleryImages)) {
            return undefined;
        }

        return this.data.galleryImages;
    }

    public get reviewsQuantity(): number | undefined {
        if (!isNumber(this.data.reviewsQuantity)) {
            return undefined;
        }
        if (typeof this.data.reviewsQuantity === 'string') {
            this.data.reviewsQuantity = parseInt(this.data.reviewsQuantity);
        }
        return this.data.reviewsQuantity;
    }

    public get offersQuantity(): number | undefined {
        if (!isNumber(this.data.offersQuantity)) {
            return undefined;
        }
        if (typeof this.data.offersQuantity === 'string') {
            this.data.offersQuantity = parseInt(this.data.offersQuantity);
        }
        return this.data.offersQuantity;
    }

    public get specification(): TProductSpecification[] | undefined {
        if (!isArray(this.data.specification)) {
            return undefined;
        }
        return this.data.specification;
    }

    public get description(): string | undefined {
        if (!isString(this.data.url)) {
            return undefined;
        }
        return this.data.description || '';
    }

    public get sellers(): TProductSeller[] | undefined {
        if (isArray(this.data.sellers)) {
            return this.data.sellers.map((x) => ({
                name: x.name,
                price: x.price,
                id: x.merchantId,
                url: x.url,
            }));
        }
        return undefined;
    }

    public get reviews(): TProductReview[] | undefined {
        if (isArray(this.data.reviews)) {
            return this.data.reviews.map((x) => ({
                author: x.author,
                date: strToDate(x.date),
                id: x.externalId,
                rating: x.rating,
            }));
        }
        return undefined;
    }

    public get hasDetalsError(): boolean {
        return this.data.errors && !!this.data.errors.details;
    }

    public get hasSpecificationError() {
        return this.data.errors && !!this.data.errors.specification;
    }

    public get hasDescriptionError() {
        return this.data.errors && !!this.data.errors.description;
    }

    public get hasSellersError(): boolean {
        return this.data.errors && !!this.data.errors.sellers;
    }

    public get hasReviewsError(): boolean {
        return this.data.errors && !!this.data.errors.reviews;
    }

    public get hasErrors(): boolean {
        return this.data.errors && Object.keys(this.data.errors).length > 0;
    }

    public get getErrorMessage(): string {
        return Object.values(this.data.errors).join(';');
    }

    public get isNotFound(): boolean {
        return Number(this.data.isNotFound) > 0;
    }
}

export class AddProductModel implements IAddProductModel {
    constructor(protected data: AddProductRequestDTO | any) {}

    isValid(): boolean {
        return !!this.code && this.url && !!this.title && this.categoryId > 0;
    }

    public get url(): string {
        return (isString(this.data.url) && this.data.url) || '';
    }

    public get code(): string {
        if (!isString(this.data.code) && !isNumber(this.data.code)) {
            this.data.code = '';
        }
        return String(this.data.code).toString();
    }

    public get title(): string {
        return (isString(this.data.title) && this.data.title) || '';
    }

    public get cartegoryPath(): TCategoryPath | undefined {
        return this.data.categories || undefined;
    }

    public get categoryId(): number {
        const path = this.cartegoryPath;
        return (path && (path.level4 || path.level3 || path.level2)) || 0;
    }
}

export class AddDetailedProductModel
    extends ProductModel
    implements IAddDetailedProductModel
{
    protected data: AddDetailedProductRequestDTO &
        SaveProductRequestDTO & { categories: ProductCategoryPathDto };

    constructor(data: AddDetailedProductRequestDTO) {
        super({
            ...data,
            id: 0,
            parsingId: 0,
            errors: null,
            isNotFound: false,
        });
    }

    isValid(): boolean {
        return !!this.code && this.url && !!this.title && !!this.categoryName;
    }

    public setId(id: number) {
        if (!this.data.id) {
            this.data.id = id;
        } else {
            throw new Error('Product id was defined before');
        }
    }

    public setCategories(path: TCategoryPath) {
        if (!this.data.categories) {
            this.data.categories = path;
        } else {
            throw new Error('Category path was defined before');
        }
    }

    public get cartegoryPath(): TCategoryPath {
        return this.data.categories || undefined;
    }

    public get categoryId(): number {
        const path = this.cartegoryPath;
        return (path && (path.level4 || path.level3 || path.level2)) || 0;
    }

    public get categoryName(): TCategoryName {
        return this.data.categoryName || undefined;
    }
}
