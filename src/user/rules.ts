export const PASSWORD_RULE = {
    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    message:
        'Password should have 1 upper case, lowcase letter along with a number and special character.',
};

export const FINGERPRINT_RULE = {
    value: /^(?=.*?[A-Za-z0-9]).{32}$/,
    message: 'Fingerprint is not correct',
};
