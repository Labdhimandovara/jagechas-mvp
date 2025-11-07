import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">🔍</span>
            <span className="text-2xl font-bold">Jagechas</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                {user.role === 'user' && (
                  <Link
                    to="/profile"
                    className="hover:text-secondary transition-colors"
                  >
                    Profile ({user.points} pts)
                  </Link>
                )}

                {(user.role === 'company' || user.role === 'admin') && (
                  <Link
                    to="/company/dashboard"
                    className="hover:text-secondary transition-colors"
                  >
                    Dashboard
                  </Link>
                )}

                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="hover:text-secondary transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}

                <span className="text-sm">
                  Hi, <span className="font-semibold">{user.name}</span>
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-secondary transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-secondary hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
