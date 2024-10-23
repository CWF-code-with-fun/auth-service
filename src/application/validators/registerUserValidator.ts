import { body } from 'express-validator';

export const registerUserValidator = [
    // body('username')
    //     .isString()
    //     .isLength({ min: 3 })
    //     .withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
        .isString()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];
