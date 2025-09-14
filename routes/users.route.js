const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users.controller');
const { registerValidation, loginValidation } = require('../middlewares/validation/userValidation');

router.route('/register')
    .post(registerValidation, usersController.register);

router.route('/login')
    .post(loginValidation, usersController.login);

// For testing 
router.route('/get-all-users')
    .get(usersController.getAllUsers);

module.exports = router;