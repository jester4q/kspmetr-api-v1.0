import {
    SaveProductRequestDTO,
    ProductSellerDTO,
    AddProductRequestDTO,
} from './product.dto';

export class ProductModel {
    constructor(private data: SaveProductRequestDTO) {}

    public get id(): number {
        if (typeof this.data.id === 'string') {
            this.data.id = parseInt(this.data.id);
        }
        return this.data.id || 0;
    }

    public get code(): string {
        return this.data.code || '';
    }

    public get parsingId(): number {
        if (typeof this.data.parsingId === 'string') {
            this.data.parsingId = parseInt(this.data.parsingId);
        }
        return this.data.parsingId;
    }

    public get title(): string {
        return this.data.title || '---';
    }

    public get unitPrice(): number {
        if (typeof this.data.unitPrice === 'string') {
            this.data.unitPrice = parseFloat(this.data.unitPrice);
        }
        return this.data.unitPrice || 0;
    }

    public get creditMonthlyPrice(): number {
        if (typeof this.data.creditMonthlyPrice === 'string') {
            this.data.creditMonthlyPrice = parseFloat(
                this.data.creditMonthlyPrice,
            );
        }
        return this.data.creditMonthlyPrice || 0;
    }

    public get rating(): number {
        if (typeof this.data.rating === 'string') {
            this.data.rating = parseFloat(this.data.rating);
        }
        return 0 + this.data.rating || 0;
    }

    public get url(): string {
        return this.data.url || '';
    }

    public get galleryImages(): any {
        return this.data.galleryImages || {};
    }

    public get reviewsQuantity(): number {
        if (typeof this.data.reviewsQuantity === 'string') {
            this.data.reviewsQuantity = parseInt(this.data.reviewsQuantity);
        }
        return this.data.reviewsQuantity || 0;
    }

    public get offersQuantity(): number {
        if (typeof this.data.offersQuantity === 'string') {
            this.data.offersQuantity = parseInt(this.data.offersQuantity);
        }
        return this.data.offersQuantity || 0;
    }

    public get specification(): { name: string; value: string }[] {
        return this.data.specification || [];
    }

    public get description(): string {
        return this.data.description || '';
    }

    public get sellers(): ProductSellerDTO[] {
        return this.data.sellers || [];
    }

    public get reviews(): {
        author: string;
        date: string;
        rating: number;
        id: string;
    }[] {
        return this.data.reviews || [];
    }

    public get hasDetalsError(): boolean {
        return this.data.errors && !this.data.errors.details;
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

    public get getErrorMessage() {
        return Object.values(this.data.errors).join(';');
    }

    public get isNotFound(): boolean {
        return Number(this.data.isNotFound) > 0;
    }
}

export class AddProductModel {
    constructor(private data: AddProductRequestDTO) {}

    public get url(): string {
        return this.data.url;
    }

    public get code(): string {
        return this.data.code;
    }

    public get title(): string {
        return this.data.title;
    }

    public get cartegoryPath(): {
        level1: number;
        level2: number;
        level3: number;
    } {
        return this.data.categories;
    }

    public get categoryId(): number {
        return this.cartegoryPath.level3;
    }
}
