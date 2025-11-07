const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticate, authorize } = require('../middleware/auth');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', productController.getAllProducts);

// @route   GET /api/products/company/:companyId
// @desc    Get products by company
// @access  Public
router.get('/company/:companyId', productController.getProductsByCompany);

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', productController.getProduct);

// @route   POST /api/products/add
// @desc    Add new product
// @access  Private (Admin only)
router.post(
  '/add',
  authenticate,
  authorize('admin'),
  productController.addProduct
);

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private (Admin only)
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.updateProduct
);

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private (Admin only)
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

module.exports = router;
