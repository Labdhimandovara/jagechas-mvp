const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/companies
// @desc    Get all companies
// @access  Public
router.get('/', companyController.getAllCompanies);

// @route   GET /api/companies/:id
// @desc    Get single company
// @access  Public
router.get('/:id', companyController.getCompany);

// @route   GET /api/companies/:id/insights
// @desc    Get company insights (analytics)
// @access  Private (Company or Admin)
router.get(
  '/:id/insights',
  authenticate,
  authorize('company', 'admin'),
  companyController.getCompanyInsights
);

// @route   POST /api/companies/add
// @desc    Add new company
// @access  Private (Admin only)
router.post(
  '/add',
  authenticate,
  authorize('admin'),
  companyController.addCompany
);

// @route   PUT /api/companies/:id
// @desc    Update company
// @access  Private (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  companyController.updateCompany
);

// @route   DELETE /api/companies/:id
// @desc    Delete company
// @access  Private (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  companyController.deleteCompany
);

module.exports = router;
