import { UserRoleEnum } from 'src/user/types';

export type TTarif = {
    id: number;
    role: UserRoleEnum;
    name: string;
    price: number;
    months: number;
};

export type TAddTarif = {
    role: UserRoleEnum;
    name: string;
    price: number;
    months: number;
};

export type TPatchTarif = {
    role?: UserRoleEnum;
    name?: string;
    price?: number;
    months?: number;
};
