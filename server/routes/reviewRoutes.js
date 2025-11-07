const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   POST /api/reviews/add
// @desc    Add new review
// @access  Private (User only)
router.post(
  '/add',
  authenticate,
  authorize('user'),
  reviewController.addReview
);

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', reviewController.getProductReviews);

// @route   GET /api/reviews/user/:userId
// @desc    Get user's reviews
// @access  Private
router.get(
  '/user/:userId',
  authenticate,
  reviewController.getUserReviews
);

// @route   DELETE /api/reviews/:id
// @desc    Delete review
// @access  Private (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  reviewController.deleteReview
);

module.exports = router;
