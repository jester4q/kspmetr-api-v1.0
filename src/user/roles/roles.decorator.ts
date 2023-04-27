import { SetMetadata } from '@nestjs/common';
import { UserRoleEnum } from '../types';

export const HasRoles = (...roles: UserRoleEnum[]) =>
    SetMetadata('roles', roles);
