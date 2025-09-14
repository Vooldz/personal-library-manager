const jwt = require('jsonwebtoken');
const clsAppError = require('../utils/clsAppError')
const httpStatusText = require('../utils/httpStatusText');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];

    if (!authHeader) {
        const error = clsAppError.create("Token is required", 401, httpStatusText.ERROR);
        return next(error);
    }

    const token = authHeader.split(" ")[1];

    try {
        const currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.currentUser = currentUser;
        next();
    } catch (err) {
        const error = clsAppError.create("Unauthorized", 401, httpStatusText.ERROR);
        return next(error);
    }
}

module.exports = verifyToken;