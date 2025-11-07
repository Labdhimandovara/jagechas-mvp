const Company = require('../models/Company');
const Product = require('../models/Product');
const Review = require('../models/Review');

// Get all companies
exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ name: 1 });
    res.json({ companies });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single company
exports.getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const products = await Product.find({ companyId: company._id });

    res.json({ company, products });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get company insights (analytics dashboard)
exports.getCompanyInsights = async (req, res) => {
  try {
    const companyId = req.params.id;

    // Verify company access
    if (req.user.role === 'company' && req.user.companyId.toString() !== companyId) {
      return res.status(403).json({ message: 'Access denied to this company data' });
    }

    // Get all products for this company
    const products = await Product.find({ companyId });
    const productIds = products.map(p => p._id);

    // Get all reviews for these products
    const reviews = await Review.find({ productId: { $in: productIds } })
      .populate('productId')
      .populate('userId', 'name email');

    // Calculate insights
    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(2)
      : 0;

    // Extract most common liked/disliked words
    const likedWords = {};
    const dislikedWords = {};

    reviews.forEach(review => {
      // Process liked words
      const liked = review.liked.toLowerCase().split(/\s+/);
      liked.forEach(word => {
        if (word.length > 3) {
          likedWords[word] = (likedWords[word] || 0) + 1;
        }
      });

      // Process disliked words
      const disliked = review.disliked.toLowerCase().split(/\s+/);
      disliked.forEach(word => {
        if (word.length > 3) {
          dislikedWords[word] = (dislikedWords[word] || 0) + 1;
        }
      });
    });

    // Get top 10 liked/disliked words
    const topLiked = Object.entries(likedWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    const topDisliked = Object.entries(dislikedWords)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));

    // Rating distribution
    const ratingDistribution = {};
    for (let i = 1; i <= 10; i++) {
      ratingDistribution[i] = 0;
    }
    reviews.forEach(review => {
      ratingDistribution[review.rating]++;
    });

    // Reviews over time (by month)
    const reviewsByMonth = {};
    reviews.forEach(review => {
      const month = new Date(review.submittedOn).toISOString().slice(0, 7);
      reviewsByMonth[month] = (reviewsByMonth[month] || 0) + 1;
    });

    res.json({
      companyId,
      products,
      totalReviews,
      avgRating: parseFloat(avgRating),
      topLiked,
      topDisliked,
      ratingDistribution,
      reviewsByMonth,
      recentReviews: reviews.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add new company (admin only)
exports.addCompany = async (req, res) => {
  try {
    const { name, industry, description, logo } = req.body;

    if (!name || !industry) {
      return res.status(400).json({ message: 'Name and industry are required' });
    }

    const company = await Company.create({
      name,
      industry,
      description,
      logo
    });

    res.status(201).json({ message: 'Company added successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update company (admin only)
exports.updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company updated successfully', company });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete company (admin only)
exports.deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
