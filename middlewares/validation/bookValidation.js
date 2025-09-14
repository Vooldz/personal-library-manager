const { body } = require('express-validator');

const createBookValidation = [
    body('title')
        .notEmpty().withMessage('Title is required')
        .trim()
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1-200 characters'),

    body('author')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Author name must be between 1-100 characters'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 3000 }).withMessage('Notes cannot exceed 3000 characters'),

    body('conclusion')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Conclusion cannot exceed 1000 characters'),

    body('rate')
        .optional()
        .isInt({ min: 0, max: 5 }).withMessage('Rating must be between 0-5')
        .toInt(),

    body('status')
        .optional()
        .isIn(['to-read', 'reading', 'finished', 'abandoned']).withMessage('Invalid status'),

    body('pages')
        .optional()
        .isInt({ min: 0 }).withMessage('Pages must be a positive number')
        .toInt(),

    body('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),

    body('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (req.body.startDate && value && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        })
];

const updateBookValidation = [
    body('title')
        .optional()
        .notEmpty().withMessage('Title cannot be empty')
        .trim()
        .isLength({ min: 1, max: 200 }).withMessage('Title must be between 1-200 characters'),

    body('author')
        .optional()
        .notEmpty().withMessage('Author cannot be empty')
        .trim()
        .isLength({ min: 1, max: 100 }).withMessage('Author name must be between 1-100 characters'),

    body('notes')
        .optional()
        .trim()
        .isLength({ max: 3000 }).withMessage('Notes cannot exceed 3000 characters'),

    body('conclusion')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('Conclusion cannot exceed 1000 characters'),

    body('rate')
        .optional()
        .isInt({ min: 0, max: 5 }).withMessage('Rating must be between 0-5')
        .toInt(),

    body('status')
        .optional()
        .isIn(['to-read', 'reading', 'finished', 'abandoned']).withMessage('Invalid status'),

    body('pages')
        .optional()
        .isInt({ min: 0 }).withMessage('Pages must be a positive number')
        .toInt(),

    body('startDate')
        .optional()
        .isISO8601().withMessage('Start date must be a valid date'),

    body('endDate')
        .optional()
        .isISO8601().withMessage('End date must be a valid date')
        .custom((value, { req }) => {
            if (req.body.startDate && value && new Date(value) < new Date(req.body.startDate)) {
                throw new Error('End date cannot be before start date');
            }
            return true;
        })
];

module.exports = {
    createBookValidation,
    updateBookValidation
}