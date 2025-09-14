const express = require('express');
const router = express.Router();
const booksController = require('../controllers/books.controller');
const verifyToken = require('../middlewares/verifyToken');
const { createBookValidation, updateBookValidation } = require('../middlewares/validation/bookValidation');
const multer = require('multer');
const clsAppError = require('../utils/clsAppError');

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/books')
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
})

const fileFilter = (req, file, cb) => {
    const isImage = file.mimetype.split('/')[0];
    if (isImage === "image") {
        return cb(null, true);
    } else {
        return cb(clsAppError.create("Only image allowed", 400), false);
    }
}

const upload = multer({
    storage: diskStorage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
})

router.route('/')
    .post(verifyToken, upload.single('cover'), createBookValidation, booksController.createBook)
    .get(verifyToken, booksController.getBooks);

router.route('/:bookId')
    .get(verifyToken, booksController.getSingleBook)
    .patch(verifyToken, upload.single('cover'), updateBookValidation, booksController.updateBook)
    .delete(verifyToken, booksController.deleteBook);

module.exports = router;