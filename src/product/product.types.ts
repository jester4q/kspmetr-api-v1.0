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
    specification: { name: string; value: string }[];
    galleryImages: { lage: string; medium: string; small: string }[];
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
