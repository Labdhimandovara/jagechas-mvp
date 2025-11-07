import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CompanyDashboard = () => {
  const { user } = useAuth();
  const [insights, setInsights] = useState(null);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.companyId) {
      fetchInsights();
    }
  }, [user]);

  const fetchInsights = async () => {
    try {
      const companyId = user.role === 'admin' ? selectedProduct : user.companyId;
      
      if (user.role === 'admin') {
        // Fetch all companies for admin
        const companiesRes = await api.get('/companies');
        setProducts(companiesRes.data.companies);
      }

      if (companyId) {
        const response = await api.get(`/companies/${companyId}/insights`);
        setInsights(response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setLoading(false);
    }
  };

  const handleCompanyChange = async (companyId) => {
    setSelectedProduct(companyId);
    setLoading(true);
    
    try {
      const response = await api.get(`/companies/${companyId}/insights`);
      setInsights(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching insights:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary">Loading dashboard...</div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600">Unable to load dashboard data</div>
      </div>
    );
  }

  const COLORS = ['#1e3a8a', '#84cc16', '#f59e0b', '#ef4444', '#8b5cf6'];

  // Prepare data for charts
  const ratingDistData = Object.entries(insights.ratingDistribution)
    .map(([rating, count]) => ({
      rating: `${rating} ⭐`,
      count,
    }))
    .filter((item) => item.count > 0);

  const topLikedData = insights.topLiked.slice(0, 8);
  const topDislikedData = insights.topDisliked.slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-primary mb-2">
          📊 Company Analytics Dashboard
        </h1>
        <p className="text-gray-600 text-lg">
          {user.role === 'admin' ? 'Admin View' : user.companyName || 'Company'} • Insights & Metrics
        </p>
      </div>

      {/* Company Selector for Admin */}
      {user.role === 'admin' && (
        <div className="mb-6 bg-white rounded-xl shadow-lg p-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Select Company:
          </label>
          <select
            value={selectedProduct}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
          >
            <option value="">Choose a company...</option>
            {products.map((company) => (
              <option key={company._id} value={company._id}>
                {company.logo} {company.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="text-sm font-semibold mb-2 opacity-90">Total Reviews</div>
          <div className="text-4xl font-bold">{insights.totalReviews}</div>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="text-sm font-semibold mb-2 opacity-90">Average Rating</div>
          <div className="text-4xl font-bold">{insights.avgRating} / 10</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="text-sm font-semibold mb-2 opacity-90">Products</div>
          <div className="text-4xl font-bold">{insights.products.length}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <div className="text-sm font-semibold mb-2 opacity-90">Sentiment</div>
          <div className="text-3xl font-bold">
            {insights.avgRating >= 7 ? '😊 Positive' : insights.avgRating >= 5 ? '😐 Neutral' : '😞 Negative'}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Rating Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ratingDistData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rating" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#84cc16" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Liked Aspects */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ✅ Top Liked Aspects
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topLikedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="word" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#1e3a8a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Disliked Aspects */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            ❌ Top Disliked Aspects
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topDislikedData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="word" type="category" width={100} />
              <Tooltip />
              <Bar dataKey="count" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Products Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Products Overview</h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto">
            {insights.products.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{product.image || '📦'}</span>
                  <div>
                    <div className="font-semibold text-gray-800">{product.name}</div>
                    <div className="text-sm text-gray-500">{product.category}</div>
                  </div>
                </div>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                >
                  {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          Recent Reviews ({insights.recentReviews.length})
        </h3>
        <div className="space-y-4">
          {insights.recentReviews.map((review) => (
            <div
              key={review._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-gray-800">
                    {review.productId.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    by {review.userId.name} •{' '}
                    {new Date(review.submittedOn).toLocaleDateString()}
                  </div>
                </div>
                <div className="bg-secondary/10 px-3 py-1 rounded-lg">
                  <span className="font-bold text-secondary">{review.rating}</span>
                  <span className="text-gray-600">/10</span>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <div className="bg-green-50 p-3 rounded">
                  <span className="font-semibold text-green-700">✅ Liked: </span>
                  <span className="text-gray-700">{review.liked}</span>
                </div>
                <div className="bg-red-50 p-3 rounded">
                  <span className="font-semibold text-red-700">❌ Disliked: </span>
                  <span className="text-gray-700">{review.disliked}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;
