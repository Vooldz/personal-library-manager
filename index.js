require('dotenv').config();
const express = require('express');
const app = express();
const httpStatusText = require('./utils/httpStatusText.js');


const mongoose = require('mongoose');

const path = require('path');

app.use('/uploads/books/', express.static(path.join(__dirname, 'uploads/books')));

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("mongodb server started");
});

app.use(express.json());

const booksRouter = require('./routes/books.route.js');
const usersRouter = require('./routes/users.route.js');

app.use('/api/books', booksRouter);
app.use('/api/users', usersRouter);


app.all(/.*/, (req, res, next) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: "This resource is not available!" });
});

app.use((error, req, res, next) => {
    return res.status(error.statusCode || 500).json({
        status: error.httpStatusText || httpStatusText.ERROR,
        message: error.message,
        statusCode: error.statusCode || 500,
        data: null
    })
});

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})