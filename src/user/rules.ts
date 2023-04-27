export const PASSWORD_RULE = {
    value: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
    message:
        'Password should have 1 upper case, lowcase letter along with a number and special character.',
};
