const { body } = require('express-validator');

const registerValidation = [
    body('firstName')
        .notEmpty()
        .withMessage('First Name is required!')
        .isLength({ min: 2, max: 50 })
        .withMessage('First Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('First Name can only contain letters and spaces')
        .trim()
        .escape(),

    body('lastName')
        .notEmpty()
        .withMessage('Last Name is required!')
        .isLength({ min: 2, max: 50 })
        .withMessage('Last Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Last Name can only contain letters and spaces')
        .trim()
        .escape(),

    body('email')
        .notEmpty()
        .withMessage('Email is required!')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),

    body('password')
        .notEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters'),
    body('confirmPassword')
        .notEmpty()
        .withMessage('Confirm Password is required!')
        .isLength({ min: 8 })
        .withMessage('Confirm Password must be at least 8 characters long')
        .isLength({ max: 128 })
        .withMessage('Confirm Password must be less than 128 characters'),
];

const loginValidation = [
    body('email')
        .notEmpty()
        .withMessage('Email is required!')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail()
        .isLength({ max: 255 })
        .withMessage('Email must be less than 255 characters'),

    body('password')
        .notEmpty()
        .withMessage('Password is required!')
        .isLength({ min: 8 })
        .withMessage('Password minimum length is 8')
        .isLength({ max: 128 })
        .withMessage('Password must be less than 128 characters')
];

module.exports = {
    registerValidation,
    loginValidation
};