const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const validateRequest = require('../middlewares/validateRequest');

// Register a new user
router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be between 3 and 50 characters'),
    body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    validateRequest
  ],
  authController.register
);

// Login a user
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
    validateRequest
  ],
  authController.login
);

// Refresh JWT token
router.post('/refresh', authController.refreshToken);

// Logout a user
router.post('/logout', authController.logout);

module.exports = router;
