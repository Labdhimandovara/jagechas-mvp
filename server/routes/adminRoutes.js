const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', adminController.getAllUsers);

// @route   GET /api/admin/reviews
// @desc    Get all reviews
// @access  Private (Admin only)
router.get('/reviews', adminController.getAllReviews);

// @route   GET /api/admin/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', adminController.getDashboardStats);

// @route   POST /api/admin/company-account
// @desc    Create company account
// @access  Private (Admin only)
router.post('/company-account', adminController.createCompanyAccount);

// @route   DELETE /api/admin/users/:id
// @desc    Delete user
// @access  Private (Admin only)
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
