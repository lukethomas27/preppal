import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleOpenFeedbackRequest = () => setShowFeedbackModal(true);
    document.addEventListener('openFeedbackModalRequest', handleOpenFeedbackRequest);
    return () =>
      document.removeEventListener('openFeedbackModalRequest', handleOpenFeedbackRequest);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleOpenFeedback = () => {
    setShowProfileMenu(false);
    setShowMobileMenu(false);
    setShowFeedbackModal(true);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/saved-plans', label: 'Saved Plans' },
    { to: '/about', label: 'About' },
  ];

  const navLinkClass = (path: string) =>
    `text-sm font-medium ${location.pathname === path ? 'text-green-600' : 'text-gray-600'} hover:text-green-600 transition`;

  return (
    <nav className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/preppal-logo.png" alt="PrepPal Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold text-green-600">PrepPal</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-3">
            {navLinks.map(({ to, label }) => {
              const isActive = location.pathname === to;
              return (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-primary text-white shadow-sm'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                    }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-green-600 focus:outline-none"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Profile Icon */}
          <div className="hidden md:flex items-center relative" ref={menuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="ml-4 h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold flex items-center justify-center"
            >
              {user?.email?.[0].toUpperCase() || 'U'}
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/recipe-generator"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Generate Recipe
                </Link>
                <Link
                  to="/recipe-test"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Test Recipe Generator
                </Link>
                <Link
                  to="/saved-plans"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Saved Plans
                </Link>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowProfileMenu(false)}
                >
                  Profile Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden mt-2 border-t border-gray-100 pt-4">
            <div className="space-y-2 pb-4">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link
                to="/saved-plans"
                className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Saved Plans
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <button
                onClick={handleOpenFeedback}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              >
                Send Feedback
              </button>
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
                onClick={() => setShowMobileMenu(false)}
              >
                Profile Settings
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-gray-50 rounded-md"
              >
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>

      <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
    </nav>
  );
};

export default Navbar;
