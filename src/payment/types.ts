export type TPayment = {
    id: number;
    status: PaymentStatusEnum;
    amount: number;
    name: string;
    token?: string;
};

export type TAddPayment = {
    tarifId: number;
    name?: string;
    amount?: number;
};

export enum PaymentStatusEnum {
    wait = 'wait',
    paid = 'paid',
    expired = 'expired',
    canceled = 'canceled',
}
