import { Injectable } from '@nestjs/common';
import { LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment, Tarif } from '../common/db/entities';
import { PaymentStatusEnum, TAddPayment, TPayment } from './types';
import { TSessionUser } from '../auth/token/authToken.service';
import { JwtService } from '@nestjs/jwt';
import appConfig from '../common/config/app.config';
import { NotFoundApiError } from '../common/error';
import { Logger } from '../common/log/logger';
import { Cron, CronExpression } from '@nestjs/schedule';

const PAYMENT_EXPIRED_IN = 24 * 60 * 60 * 1000;
const TOKEN_EXPIRED_IN = '1d';

@Injectable()
export class PaymentService {
    private logger = new Logger('payment-service-job');

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Tarif)
        private tarifRepository: Repository<Tarif>,
        private jwt: JwtService,
    ) {}

    @Cron(CronExpression.EVERY_30_MINUTES)
    async handleCron() {
        const expiredDate = new Date();
        expiredDate.setDate(expiredDate.getDate() - 1);
        const result = this.paymentRepository
            .createQueryBuilder()
            .update(Payment)
            .set({ status: PaymentStatusEnum.expired })
            .where({
                status: PaymentStatusEnum.wait,
                createdAt: LessThan(expiredDate),
            })
            .execute();

        this.logger.log('UPDATE Payment status ' + JSON.stringify(result));
    }

    async add(session: TSessionUser, data: TAddPayment): Promise<TPayment> {
        const tarif = await this.tarifRepository.findOneBy({ id: data.tarifId, status: 1 });
        if (!tarif) {
            throw new NotFoundApiError('The tarif is not defined by id ' + data.tarifId);
        }
        const payment = this.paymentRepository.create({
            userId: session.userId,
            createdAt: new Date(),
            name: data.name || tarif.name,
            amount: data.amount || tarif.price,
            tarifId: tarif.id,
            status: PaymentStatusEnum.wait,
        });
        await payment.save();
        return this.toPayment(payment, this.token(payment));
    }

    async verifyToken(token: string) {
        let result: { sub: string; token: string };
        try {
            result = this.jwt.verify<{ sub: string; token: string }>(token, {
                secret: appConfig().appSecret,
                ignoreExpiration: false,
            });
        } catch (error) {
            throw new NotFoundApiError('The payment token is not valid');
        }

        const paymentId = parseInt(result.sub);
        if (isNaN(paymentId) || paymentId <= 0) {
            throw new NotFoundApiError('The payment token is not valid');
        }

        const payment = await this.paymentRepository.findOneBy({ id: paymentId });
        if (!payment) {
            throw new NotFoundApiError('The payment token is not valid');
        }
        this.checkStatus(payment);
        return this.toPayment(payment);
    }

    protected async checkStatus(payment: Payment) {
        if (payment.status === PaymentStatusEnum.wait) {
            console.log(new Date().getTime() - payment.createdAt.getTime());
            const expired = new Date().getTime() - payment.createdAt.getTime() > PAYMENT_EXPIRED_IN;
            if (expired) {
                payment.status = PaymentStatusEnum.expired;
                await payment.save();
            }
        }
        return payment;
    }

    protected token(payment: Payment) {
        const token = this.jwt.sign(
            {
                sub: payment.id,
                token: Buffer.from(payment.tarifId + '_' + payment.amount + ' ' + payment.name).toString('base64'),
            },
            { secret: appConfig().appSecret, expiresIn: TOKEN_EXPIRED_IN },
        );

        return token;
    }

    protected toPayment(payment: Payment, token?: string): TPayment {
        return {
            id: payment.id,
            name: payment.name,
            status: payment.status,
            amount: payment.amount,
            token: token,
        };
    }
}
