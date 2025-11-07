const Review = require('../models/Review');
const User = require('../models/User');
const Product = require('../models/Product');

// Get all reviews
exports.getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('userId', 'name email')
      .populate({
        path: 'productId',
        populate: { path: 'companyId', select: 'name' }
      })
      .sort({ submittedOn: -1 })
      .limit(100); // Limit to prevent huge payloads

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new review
exports.addReview = async (req, res) => {
  try {
    const { productId, liked, disliked, rating, comment } = req.body;
    const userId = req.user._id;

    // Validate input
    if (!productId || !liked || !disliked || !rating) {
      return res.status(400).json({ 
        message: 'Product, liked, disliked, and rating are required' 
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 10) {
      return res.status(400).json({ message: 'Rating must be between 1 and 10' });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Create review
    const review = await Review.create({
      userId,
      productId,
      liked,
      disliked,
      rating,
      comment
    });

    // Add 10 points to user
    await User.findByIdAndUpdate(userId, { $inc: { points: 10 } });

    // Get updated user points
    const user = await User.findById(userId).select('points');

    await review.populate('productId');

    res.status(201).json({ 
      message: 'Review submitted successfully! You earned 10 points.',
      review,
      newPoints: user.points
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reviews for a product
exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ productId })
      .populate('userId', 'name email')
      .sort({ submittedOn: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.params.userId;

    const reviews = await Review.find({ userId })
      .populate('productId')
      .populate({
        path: 'productId',
        populate: { path: 'companyId' }
      })
      .sort({ submittedOn: -1 });

    res.json({ reviews });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete review (admin only)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Deduct 10 points from user
    await User.findByIdAndUpdate(review.userId, { $inc: { points: -10 } });

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
