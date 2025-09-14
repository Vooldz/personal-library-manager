const { validationResult } = require('express-validator');
const clsAppError = require('../utils/clsAppError');
const httpStatusText = require('../utils/httpStatusText');
const User = require('../models/user.model');
const asyncWrapper = require('../middlewares/asyncWrapper');
const generateJWT = require('../utils/generateJWT');
const bcryptjs = require('bcryptjs');

const register = asyncWrapper(
    async (req, res, next) => {

        const { firstName, lastName, email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            const error = clsAppError.create("Password does not match!", 400, httpStatusText.FAIL);
            return next(error);
        }

        const oldUser = await User.findOne({ email: email });

        if (oldUser) {
            const error = clsAppError.create("User already exists!", 400, httpStatusText.FAIL);
            return next(error);
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = clsAppError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }
        const hashedPassword = await bcryptjs.hash(password, 10);

        const newUser = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashedPassword
        });

        await newUser.save();

        const token = await generateJWT({ email: newUser.email, id: newUser._id });

        res.status(201).json({
            status: httpStatusText.SUCCESS, data: {
                token,
                user: {
                    id: newUser._id,
                    firstName: newUser.firstName,
                    lastName: newUser.lastName,
                    email: newUser.email
                }
            }
        });
    });

const login = asyncWrapper(
    async (req, res, next) => {

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const error = clsAppError.create(errors.array(), 400, httpStatusText.FAIL);
            return next(error);
        }

        const { email, password } = req.body;

        const oldUser = await User.findOne({ email: email });

        if (!oldUser) {
            const error = clsAppError.create("Invalid email or password", 401, httpStatusText.FAIL);
            return next(error);
        }

        const checkPassword = await bcryptjs.compare(password, oldUser.password);

        if (!checkPassword) {
            const error = clsAppError.create("Invalid email or password", 401, httpStatusText.FAIL);
            return next(error);
        }

        const token = await generateJWT({ email: oldUser.email, id: oldUser._id });

        return res.status(200).json({
            status: httpStatusText.SUCCESS, data: {
                token,
                user: {
                    id: oldUser._id,
                    firstName: oldUser.firstName,
                    lastName: oldUser.lastName,
                    email: oldUser.email
                }
            }
        })
    }
);

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        const users = await User.find();
        return res.status(200).json({ status: httpStatusText.SUCCESS, data: { users } });
    }
)

module.exports = {
    register,
    login,
    getAllUsers
}