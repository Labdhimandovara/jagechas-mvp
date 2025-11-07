const Review = require('../models/Review');
const User = require('../models/User');

// Get user profile with reviews
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Get user data
    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's reviews
    const reviews = await Review.find({ userId })
      .populate('productId')
      .sort({ submittedOn: -1 });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        points: user.points,
        role: user.role
      },
      reviews
    });
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
