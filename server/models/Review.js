const mongoose = require('mongoose');

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product ID is required']
  },
  liked: {
    type: String,
    required: [true, 'Liked field is required'],
    trim: true
  },
  disliked: {
    type: String,
    required: [true, 'Disliked field is required'],
    trim: true
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: 1,
    max: 10
  },
  comment: {
    type: String,
    default: '',
    trim: true
  },
  submittedOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', reviewSchema);
