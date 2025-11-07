const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// @route   GET /api/users/:userId
// @desc    Get user profile
// @access  Private
router.get('/:userId', authenticate, userController.getUserProfile);

// @route   GET /api/users/:userId/reviews
// @desc    Get user's reviews
// @access  Private
router.get('/:userId/reviews', authenticate, userController.getUserReviews);

module.exports = router;
