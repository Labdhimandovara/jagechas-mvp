import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ReviewForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    liked: '',
    disliked: '',
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProduct(response.data.product);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await api.post('/reviews/add', {
        productId,
        ...formData,
      });

      // Update user points
      if (response.data.newPoints) {
        updateUser({ ...user, points: response.data.newPoints });
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.message || 'Failed to submit review');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Product not found</div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-white rounded-2xl shadow-2xl p-12 animate-fadeIn">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-secondary mb-4">
            Review Submitted Successfully!
          </h2>
          <p className="text-xl text-gray-600 mb-2">
            You earned <span className="font-bold text-secondary">10 points</span>!
          </p>
          <p className="text-gray-500">Redirecting to your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
        {/* Product Info */}
        <div className="mb-8 pb-6 border-b">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{product.image || '📦'}</span>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
              <p className="text-gray-600">
                {product.companyId.logo} {product.companyId.name}
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              What did you like? ✅
            </label>
            <textarea
              name="liked"
              value={formData.liked}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
              placeholder="Share what you loved about this product..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              What didn't you like? ❌
            </label>
            <textarea
              name="disliked"
              value={formData.disliked}
              onChange={handleChange}
              required
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
              placeholder="Share what could be improved..."
            />
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Rating: <span className="text-secondary">{formData.rating}/10</span>
            </label>
            <input
              type="range"
              name="rating"
              value={formData.rating}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-secondary"
            />
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Additional Comments (Optional) 💬
            </label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition resize-none"
              placeholder="Any other thoughts you'd like to share..."
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-secondary hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Review & Earn 10 Points 🎯'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewForm;
