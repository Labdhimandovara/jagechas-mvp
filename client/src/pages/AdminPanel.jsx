import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form states
  const [companyForm, setCompanyForm] = useState({
    name: '',
    industry: '',
    description: '',
    logo: '',
  });

  const [productForm, setProductForm] = useState({
    name: '',
    companyId: '',
    category: '',
    description: '',
    image: '',
  });

  const [companyAccountForm, setCompanyAccountForm] = useState({
    name: '',
    email: '',
    password: '',
    companyId: '',
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case 'stats':
          const statsRes = await api.get('/admin/stats');
          setStats(statsRes.data);
          break;
        case 'users':
          const usersRes = await api.get('/admin/users');
          setUsers(usersRes.data.users);
          break;
        case 'reviews':
          const reviewsRes = await api.get('/admin/reviews');
          setReviews(reviewsRes.data.reviews);
          break;
        case 'companies':
          const companiesRes = await api.get('/companies');
          setCompanies(companiesRes.data.companies);
          break;
        case 'products':
          const [productsRes, companiesRes2] = await Promise.all([
            api.get('/products'),
            api.get('/companies'),
          ]);
          setProducts(productsRes.data.products);
          setCompanies(companiesRes2.data.companies);
          break;
        default:
          break;
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies/add', companyForm);
      alert('Company added successfully!');
      setCompanyForm({ name: '', industry: '', description: '', logo: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add company');
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products/add', productForm);
      alert('Product added successfully!');
      setProductForm({ name: '', companyId: '', category: '', description: '', image: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add product');
    }
  };

  const handleCreateCompanyAccount = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/company-account', companyAccountForm);
      alert('Company account created successfully!');
      setCompanyAccountForm({ name: '', email: '', password: '', companyId: '' });
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create company account');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/reviews/${reviewId}`);
        alert('Review deleted successfully!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete review');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        alert('User deleted successfully!');
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">⚙️ Admin Panel</h1>
        <p className="text-gray-600 text-lg">Manage companies, products, users, and reviews</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl shadow-lg p-2">
        {['stats', 'users', 'reviews', 'companies', 'products', 'accounts'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors capitalize ${
              activeTab === tab
                ? 'bg-primary text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="text-xl font-semibold text-primary">Loading...</div>
        </div>
      ) : (
        <>
          {/* Statistics Tab */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-xl shadow-lg p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Total Users</div>
                  <div className="text-4xl font-bold">{stats.stats.totalUsers}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-xl shadow-lg p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Total Companies</div>
                  <div className="text-4xl font-bold">{stats.stats.totalCompanies}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Total Products</div>
                  <div className="text-4xl font-bold">{stats.stats.totalProducts}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 text-white rounded-xl shadow-lg p-6">
                  <div className="text-sm font-semibold mb-2 opacity-90">Total Reviews</div>
                  <div className="text-4xl font-bold">{stats.stats.totalReviews}</div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Recent Reviews</h3>
                <div className="space-y-3">
                  {stats.recentReviews.map((review) => (
                    <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{review.productId.name}</div>
                          <div className="text-sm text-gray-500">
                            by {review.userId.name} • {new Date(review.submittedOn).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="bg-secondary/10 px-3 py-1 rounded-lg">
                          <span className="font-bold text-secondary">{review.rating}</span>/10
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">All Users ({users.length})</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Points</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{user.name}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' :
                            user.role === 'company' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">{user.points}</td>
                        <td className="px-4 py-3">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="text-red-600 hover:text-red-800 text-sm font-semibold"
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">All Reviews ({reviews.length})</h3>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-semibold text-gray-800">{review.productId.name}</div>
                        <div className="text-sm text-gray-500">
                          {review.productId.companyId.name} • by {review.userId.name}
                        </div>
                        <div className="text-xs text-gray-400">{new Date(review.submittedOn).toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 px-3 py-1 rounded-lg">
                          <span className="font-bold text-secondary">{review.rating}</span>/10
                        </div>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-red-600 hover:text-red-800 text-sm font-semibold"
                        >
                          Delete
                        </button>
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
          )}

          {/* Companies Tab */}
          {activeTab === 'companies' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Company</h3>
                <form onSubmit={handleAddCompany} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={companyForm.name}
                      onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Industry"
                      value={companyForm.industry}
                      onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Logo (emoji)"
                    value={companyForm.logo}
                    onChange={(e) => setCompanyForm({ ...companyForm, logo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <textarea
                    placeholder="Description"
                    value={companyForm.description}
                    onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="w-full bg-secondary hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Company
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">All Companies ({companies.length})</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {companies.map((company) => (
                    <div key={company._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{company.logo}</span>
                        <div>
                          <div className="font-semibold text-gray-800">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.industry}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Add New Product</h3>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                    <select
                      value={productForm.companyId}
                      onChange={(e) => setProductForm({ ...productForm, companyId: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="">Select Company</option>
                      {companies.map((company) => (
                        <option key={company._id} value={company._id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      required
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Image (emoji)"
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                  <textarea
                    placeholder="Description"
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    rows="3"
                  />
                  <button
                    type="submit"
                    className="w-full bg-secondary hover:bg-green-600 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    Add Product
                  </button>
                </form>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">All Products ({products.length})</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <div key={product._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{product.image || '📦'}</span>
                        <div className="font-semibold text-gray-800">{product.name}</div>
                      </div>
                      <div className="text-sm text-gray-500">{product.companyId.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{product.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Company Accounts Tab */}
          {activeTab === 'accounts' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Create Company Account</h3>
              <form onSubmit={handleCreateCompanyAccount} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Manager Name"
                    value={companyAccountForm.name}
                    onChange={(e) => setCompanyAccountForm({ ...companyAccountForm, name: e.target.value })}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={companyAccountForm.email}
                    onChange={(e) => setCompanyAccountForm({ ...companyAccountForm, email: e.target.value })}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="password"
                    placeholder="Password"
                    value={companyAccountForm.password}
                    onChange={(e) => setCompanyAccountForm({ ...companyAccountForm, password: e.target.value })}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  />
                  <select
                    value={companyAccountForm.companyId}
                    onChange={(e) => setCompanyAccountForm({ ...companyAccountForm, companyId: e.target.value })}
                    required
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select Company</option>
                    {companies.map((company) => (
                      <option key={company._id} value={company._id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-900 text-white py-2 rounded-lg font-semibold transition-colors"
                >
                  Create Company Account
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
