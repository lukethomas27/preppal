import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';
import { Menu, X } from 'lucide-react';
import { Popover } from '@headlessui/react';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/saved-plans', label: 'Saved Plans' },
    { to: '/about', label: 'About' },
  ];

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
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-lg ${
                  location.pathname === to ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 text-gray-600 hover:text-green-600"
            >
              {showMobileMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Profile Icon */}
          <div className="hidden md:flex items-center">
            <Popover className="relative">
              {({ open }) => (
                <>
                  <Popover.Button
                    className="ml-4 h-8 w-8 rounded-full bg-green-100 text-green-600 font-semibold flex items-center justify-center hover:bg-green-200 transition-colors duration-150 focus:outline-none"
                  >
                    {user?.email?.[0].toUpperCase() || 'U'}
                  </Popover.Button>

                  <Popover.Panel className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100">
                    <div className="px-4 py-1.5 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.email}</p>
                    </div>
                    <div className="divide-y divide-gray-100">
                      <button
                        onClick={() => {
                          navigate('/recipe-generator');
                        }}
                        className="w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Generate Recipe
                      </button>
                      <button
                        onClick={() => {
                          navigate('/recipe-test');
                        }}
                        className="w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Test Recipe Generator
                      </button>
                      <button
                        onClick={() => {
                          navigate('/saved-plans');
                        }}
                        className="w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                        Saved Plans
                      </button>
                      <button
                        onClick={() => {
                          navigate('/profile');
                        }}
                        className="w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors duration-150 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-red-600 transition-colors duration-150 flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </Popover.Panel>
                </>
              )}
            </Popover>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {showMobileMenu && (
          <div className="md:hidden mt-2 border-t border-gray-100 pt-4">
            <div className="space-y-2 pb-4">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  setShowFeedbackModal(true);
                }}
                className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Send Feedback
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
