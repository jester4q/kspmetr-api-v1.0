export type TUserAdd = {
    email: string;
    password: string;
    fingerprint?: string;
    roles: UserRoleEnum[];
};

export type TUserUpdate = {
    email?: string;
    password?: string;
    roles?: UserRoleEnum[];
};

export enum UserRoleEnum {
    none = 'none',
    admin = 'admin',
    parser = 'parser',
    chromeExtension = 'chrome_ext',
    siteUser = 'site_user',
    premiumUser = 'premium_user',
}

export enum VerificationType {
    signup = 'signup',
    resetpassword = 'resetpassword',
}
