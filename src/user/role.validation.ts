import { Injectable, BadRequestException } from '@nestjs/common';
import { UserRoleEnum } from './types';
import { ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

@ValidatorConstraint({ name: 'RoleValidation' })
@Injectable()
export class RoleValidation implements ValidatorConstraintInterface {
    validate(value: string[]): boolean {
        if (!Array.isArray(value)) {
            throw new BadRequestException('Roles is not right format');
        }
        let hasSiteRole = false;
        let hasExtRole = false;
        let hasPremiumRole = false;
        for (let i = 0; i < value.length; i++) {
            const role: UserRoleEnum = value[i] as UserRoleEnum;
            if (!Object.values(UserRoleEnum).includes(role)) {
                throw new BadRequestException('Roles is not right format');
            }
            if (role == UserRoleEnum.chromeExtension) {
                hasExtRole = true;
            }
            if (role == UserRoleEnum.siteUser) {
                hasSiteRole = true;
            }
            if (role == UserRoleEnum.premiumUser) {
                hasPremiumRole = true;
            }
        }

        if (value.length > 1 && (hasExtRole || hasSiteRole || hasPremiumRole)) {
            throw new BadRequestException('User role must be single');
        }

        return true;
    }
}
