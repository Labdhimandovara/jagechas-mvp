import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const UserProfile = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserReviews();
    }
  }, [user]);

  const fetchUserReviews = async () => {
    try {
      const response = await api.get(`/reviews/user/${user.id}`);
      setReviews(response.data.reviews);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-primary to-blue-900 text-white rounded-2xl shadow-2xl p-8 mb-8 animate-fadeIn">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">👤 {user.name}</h1>
            <p className="text-blue-200 text-lg">{user.email}</p>
          </div>
          <div className="text-center bg-white/20 backdrop-blur rounded-xl px-8 py-4">
            <div className="text-5xl font-bold text-secondary">{user.points}</div>
            <div className="text-sm mt-1">Total Points</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-blue-700">
          <div className="text-center">
            <div className="text-2xl font-bold">{reviews.length}</div>
            <div className="text-sm text-blue-200">Reviews Written</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">
              {reviews.length > 0
                ? (
                    reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
                  ).toFixed(1)
                : '0'}
            </div>
            <div className="text-sm text-blue-200">Avg Rating Given</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{user.points / 10}</div>
            <div className="text-sm text-blue-200">Points to Next Level</div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Your Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start writing reviews to earn points and help companies improve!
            </p>
            <a
              href="/"
              className="inline-block bg-secondary hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-shadow animate-fadeIn"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">
                      {review.productId.image || '📦'}
                    </span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        {review.productId.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {review.productId.companyId?.name} •{' '}
                        {new Date(review.submittedOn).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 px-4 py-2 rounded-lg">
                    <span className="text-2xl font-bold text-secondary">
                      {review.rating}
                    </span>
                    <span className="text-gray-600">/10</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                      ✅ Liked
                    </div>
                    <p className="text-gray-700 text-sm">{review.liked}</p>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                      ❌ Disliked
                    </div>
                    <p className="text-gray-700 text-sm">{review.disliked}</p>
                  </div>
                </div>

                {review.comment && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      💬 Additional Comments
                    </div>
                    <p className="text-gray-700 text-sm">{review.comment}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
