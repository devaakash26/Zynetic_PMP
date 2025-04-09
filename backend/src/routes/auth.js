const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const { authMiddleware } = require('../middlewares/auth');

// Register new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);


module.exports = router; 