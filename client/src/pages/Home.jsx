import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [companiesRes, productsRes] = await Promise.all([
        api.get('/companies'),
        api.get('/products'),
      ]);

      setCompanies(companiesRes.data.companies);
      setProducts(productsRes.data.products);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const filteredProducts =
    selectedCompany === 'all'
      ? products
      : products.filter((p) => p.companyId._id === selectedCompany);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-5xl font-bold text-primary mb-4">
          Welcome to Jagechas 🔍
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Share your product experiences, earn points, and help companies improve!
        </p>

        {!user && (
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="bg-secondary hover:bg-green-600 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="bg-primary hover:bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors"
            >
              Company Login
            </Link>
          </div>
        )}
      </div>

      {/* Company Filter */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-700 mb-3">
          Filter by Company:
        </label>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setSelectedCompany('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCompany === 'all'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            } shadow-md`}
          >
            All Companies
          </button>
          {companies.map((company) => (
            <button
              key={company._id}
              onClick={() => setSelectedCompany(company._id)}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCompany === company._id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } shadow-md`}
            >
              {company.logo} {company.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Browse Products ({filteredProducts.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-5xl">{product.image || '📦'}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {product.category}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {product.name}
            </h3>

            <p className="text-sm text-gray-600 mb-3">
              {product.companyId.logo} {product.companyId.name}
            </p>

            <p className="text-gray-600 mb-4 text-sm">
              {product.description || 'Great product from a trusted brand'}
            </p>

            {user && user.role === 'user' ? (
              <Link
                to={`/review/${product._id}`}
                className="block w-full bg-secondary hover:bg-green-600 text-white text-center py-2 rounded-lg font-semibold transition-colors"
              >
                Write Review ✍️
              </Link>
            ) : (
              <div className="text-center text-gray-500 text-sm">
                {!user ? 'Login to write a review' : 'Product from ' + product.companyId.name}
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">No products found</p>
        </div>
      )}
    </div>
  );
};

export default Home;
