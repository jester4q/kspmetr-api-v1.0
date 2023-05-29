export type TProduct = {
    id: number;
    code: string;
    title: string;
    url: string;
    unitPrice: number;
    creditMonthlyPrice: number;
    offersQuantity: number;
    reviewsQuantity: number;
    description: string;
    specification: TProductSpecification[];
    galleryImages: TProductImage[];
    lastCheckedAt: Date;
    productRating: number;
};

export type TCategoryProduct = {
    id: number;
    code: string;
    title: string;
    url: string;
};

export type TCategoryPath = {
    level1: number;
    level2: number;
    level3?: number;
    level4?: number;
};

export type TCategoryName = {
    level1: string;
    level2: string;
    level3?: string;
    level4?: string;
};

export type TProductImage = {
    large: string;
    medium: string;
    small: string;
};

export type TProductSpecification = {
    name: string;
    value: string;
};

export type TProductSeller = {
    name: string;
    price: number;
    id: string;
    url: string;
};

export type TProductReview = {
    author: string;
    date: Date | null;
    rating: number;
    externalId: string;
};
