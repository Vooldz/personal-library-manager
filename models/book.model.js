const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    author: {
        type: String,
        trim: true,
        maxLength: [100, 'Author name cannot exceed 100 characters'],
        default: ''
    },
    notes: {
        type: String,
        trim: true,
        maxLength: [3000, 'Notes cannot exceed 2000 characters'],
        default: ''
    },
    conclusion: {
        type: String,
        trim: true,
        maxLength: [1000, 'Conclusion cannot exceed 1000 characters'],
        default: ''
    },
    rate: {
        type: Number,
        min: [0, 'Rating cannot be less than 0'],
        max: [5, 'Rating cannot exceed 5'],
        default: 0
    },
    status: {
        type: String,
        enum: {
            values: ['to-read', 'reading', 'finished', 'abandoned'],
            message: 'Status must be: to-read, reading, finished, or abandoned'
        },
        default: 'to-read'
    },
    pages: {
        type: Number,
        min: [0, 'Page count cannot be negative'],
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    cover: {
        type: String,
        default: 'default-book.png'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

bookSchema.index({ userId: 1 });
bookSchema.index({ userId: 1, createdAt: -1 });
bookSchema.index({ userId: 1, title: 1 });
bookSchema.index({
    userId: 1,
    title: "text",
    author: "text"
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;