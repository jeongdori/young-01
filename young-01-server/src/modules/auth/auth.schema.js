const Joi = require('joi');

const baseAuthSchema = {
    email: Joi.string().email().required().messages({
        'string.email': '이메일 형식이 아닙니다',
        'any.required': '이메일은 필수 입력입니다',
    }),
    password: Joi.string().required().messages({
        'any.required': '비밀번호는 필수 입력입니다',
    }),
};

exports.loginSchema = Joi.object({
    ...baseAuthSchema,
});

exports.registerSchema = Joi.object({
    ...baseAuthSchema,
    password: Joi.string()
        .min(8)
        .max(16)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/)
        .required()
        .messages({
            'string.pattern.base':
                '비밀번호는 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다',
            'string.min': '비밀번호는 최소 8자리 이상이어야 합니다',
            'string.max': '비밀번호는 최대 16자리까지 가능합니다',
            'any.required': '비밀번호는 필수 입력입니다',
        }),
    name: Joi.string().min(2).required().messages({
        'string.min': '이름은 최소 2자리 이상이어야 합니다',
        'any.required': '이름은 필수 입력입니다',
    }),
    // address: Joi.object({
    //     zip: Joi.string()
    //         .pattern(/^\d{5}$/)
    //         .required()
    //         .messages({
    //             'string.pattern.base': '우편번호는 5자리 숫자여야 합니다',
    //             'any.required': '우편번호는 필수 입력입니다',
    //         }),
    //     city: Joi.string().required().messages({
    //         'any.required': '도시는 필수 입력입니다',
    //     }),
    //     street: Joi.string().required().messages({
    //         'any.required': '도로명은 필수 입력입니다',
    //     }),
    // })
    //     .required()
    //     .messages({
    //         'any.required': '주소 정보는 필수입니다',
    //     }),
});
