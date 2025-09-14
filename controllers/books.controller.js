const asyncWrapper = require("../middlewares/asyncWrapper");
const { validationResult } = require('express-validator');
const clsAppError = require('../utils/clsAppError');
const httpStatusText = require('../utils/httpStatusText');
const Book = require('../models/book.model');
const User = require('../models/user.model');
const { isValidObjectId } = require("mongoose");
const fs = require('fs');
const path = require('path');

const createBook = asyncWrapper(
    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = clsAppError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }

        const { title, author, notes, conclusion, rate,
            status, pages, startDate, endDate } = req.body;

        const userId = req.currentUser.id;

        const existingBook = await Book.findOne({
            userId: userId,
            title: { $regex: new RegExp(`^${title}$`, 'i') }
        });

        if (existingBook) {
            const error = clsAppError.create("Book is already exist!", 400, httpStatusText.FAIL);
            return next(error);
        }

        const existingUser = await User.findById(userId);

        if (!existingUser) {
            const error = clsAppError.create("User was not found!", 404, httpStatusText.FAIL);
            return next(error);
        }

        const newBook = new Book({
            title, author, notes, conclusion, rate,
            status, pages, startDate, endDate, userId,
        });

        if (req.file) {
            newBook.cover = req.file.filename;
        }

        await newBook.save();

        return res.status(201).json({ status: httpStatusText.SUCCESS, data: { book: newBook } });

    }
);

const getBooks = asyncWrapper(
    async (req, res, next) => {
        const userId = req.currentUser.id;
        if (!userId) {
            const error = clsAppError.create("Unauthorized", 401, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(userId)) {
            const error = clsAppError.create("Invalid User", 403, httpStatusText.FAIL);
            return next(error);
        }

        const limit = Math.min(parseInt(req.query.limit) || 10, 100);
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const filter = { userId: userId };
        if (search) {
            filter.$text = { $search: search }
        }

        const totalBooks = await Book.countDocuments(filter);
        const totalPages = Math.ceil(totalBooks / limit) || 1;

        if (page > totalPages && totalPages > 0) {
            const error = clsAppError.create("Page not found", 404, httpStatusText.ERROR);
            return next(error);
        }

        if (totalBooks === 0) {
            return res.status(200).json({
                status: httpStatusText.SUCCESS,
                data: { books: [], totalBooks: 0, totalPages: 0, page: 1 }
            });
        }

        const books = await Book.find(filter).sort({ createdAt: -1 }).limit(limit).skip(skip);

        res.status(200).json({
            status: httpStatusText.SUCCESS, data: {
                books, totalBooks, totalPages, page, searchQuery: search
            }
        });
    }
);

const getSingleBook = asyncWrapper(
    async (req, res, next) => {
        const bookId = req.params.bookId;
        const userId = req.currentUser.id;

        if (!userId) {
            const error = clsAppError.create("Unauthorized", 401, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(bookId)) {
            const error = clsAppError.create("Please provide a correct book Id", 400, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(userId)) {
            const error = clsAppError.create("Invalid User", 403, httpStatusText.FAIL);
            return next(error);
        }

        const book = await Book.findOne({
            _id: bookId,
            userId: userId
        });

        if (!book) {
            const error = clsAppError.create("Book not found", 404, httpStatusText.FAIL);
            return next(error);
        }

        res.status(200).json({ status: httpStatusText.SUCCESS, data: { book } });
    }
);

const updateBook = asyncWrapper(
    async (req, res, next) => {
        const bookId = req.params.bookId;
        const userId = req.currentUser.id

        if (!userId) {
            const error = clsAppError.create("Unauthorized", 401, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(bookId)) {
            const error = clsAppError.create("Please provide a correct book Id", 400, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(userId)) {
            const error = clsAppError.create("Invalid User", 403, httpStatusText.FAIL);
            return next(error);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = clsAppError.create(errors.array(), 404, httpStatusText.FAIL);
            return next(error);
        }

        if (!req.body) {
            const error = clsAppError.create("Request body is missing", 404, httpStatusText.FAIL);
            return next(error);
        }

        const { title, author, notes, conclusion, rate, status, pages, startDate, endDate } = req.body;

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (author !== undefined) updateData.author = author;
        if (notes !== undefined) updateData.notes = notes;
        if (conclusion !== undefined) updateData.conclusion = conclusion;
        if (rate !== undefined) updateData.rate = rate;
        if (status !== undefined) updateData.status = status;
        if (pages !== undefined) updateData.pages = pages;
        if (startDate !== undefined) updateData.startDate = startDate;
        if (endDate !== undefined) updateData.endDate = endDate;

        if (req.file) {
            updateData.cover = req.file.filename;
            const oldBook = await Book.findById(bookId);

            if (oldBook.cover && oldBook.cover !== 'default-book.png') {
                const oldImagePath = path.join('uploads/books/', oldBook.cover);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlink(oldImagePath, (err) => {
                        if (err) console.error('Error deleting old image:', err);
                    });
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            const error = clsAppError.create("No valid fields provided for update", 400, httpStatusText.FAIL);
            return next(error);
        }

        const result = await Book.updateOne(
            { _id: bookId, userId: userId },
            { $set: updateData },
            { runValidators: true }
        );

        if (result.modifiedCount === 0) {
            const error = clsAppError.create("Book not found", 404, httpStatusText.FAIL);
            return next(error);
        }

        const updatedBook = await Book.findById(bookId);

        res.status(200).json({ status: httpStatusText.SUCCESS, data: { book: updatedBook } });
    }
);

const deleteBook = asyncWrapper(
    async (req, res, next) => {
        const bookId = req.params.bookId;
        const userId = req.currentUser.id;

        if (!userId) {
            const error = clsAppError.create("Unauthorized", 401, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(bookId)) {
            const error = clsAppError.create("Please provide a correct book Id", 400, httpStatusText.FAIL);
            return next(error);
        }

        if (!isValidObjectId(userId)) {
            const error = clsAppError.create("Invalid User", 403, httpStatusText.FAIL);
            return next(error);
        }

        const result = await Book.deleteOne({ _id: bookId, userId: userId });

        if (result.deletedCount === 0) {
            const error = clsAppError.create("Book was not found", 404, httpStatusText.FAIL);
            return next(error);
        }

        return res.status(200).json({ status: httpStatusText.SUCCESS, data: null });
    }
);

module.exports = {
    createBook,
    getBooks,
    getSingleBook,
    updateBook,
    deleteBook
}