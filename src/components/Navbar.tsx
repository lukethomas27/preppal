import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import FeedbackModal from './FeedbackModal';

const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Listen for feedback modal request event
  useEffect(() => {
    const handleOpenFeedbackRequest = () => {
      setShowFeedbackModal(true);
    };
    
    document.addEventListener('openFeedbackModalRequest', handleOpenFeedbackRequest);
    return () => {
      document.removeEventListener('openFeedbackModalRequest', handleOpenFeedbackRequest);
    };
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

  return (
    <>
      <nav className="w-full bg-white shadow-sm">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <img 
                  src="/preppal-logo.png" 
                  alt="PrepPal Logo" 
                  className="h-10 w-auto mr-2" 
                />
                <h1 className="text-xl font-semibold text-gray-800">PrepPal</h1>
              </div>
              
              <div className="hidden md:flex ml-10 space-x-8">
                <Link 
                  to="/about" 
                  className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium"
                >
                  About Us
                </Link>
              </div>
            </div>
            
            <div className="flex items-center">
              {user && (
                <div className="hidden sm:flex items-center space-x-4">
                  <button 
                    className="btn btn-cta rounded-md" 
                    onClick={() => navigate('/')}
                  >
                    Prep Now
                  </button>
                </div>
              )}
              
              {/* Mobile menu button */}
              <button 
                className="md:hidden ml-2 p-2 rounded-md text-gray-600 hover:text-primary-600 hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  {showMobileMenu ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              {user && (
                <div className="relative ml-4" ref={menuRef}>
                  <button 
                    className="user-avatar-button flex items-center space-x-2"
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-700">
                        {user.email?.[0].toUpperCase()}
                      </span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700">
                      {user.email}
                    </span>
                  </button>
                  
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white py-1 z-20 dropdown-menu">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {user.email}
                        </p>
                        <p className="text-xs text-gray-500">
                          Member since {new Date(user.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button 
                        className="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                          navigate('/profile');
                          setShowProfileMenu(false);
                        }}
                      >
                        Profile Settings
                      </button>
                      <button 
                        className="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700"
                        onClick={() => {
                          navigate('/saved-plans');
                          setShowProfileMenu(false);
                        }}
                      >
                        Saved Plans
                      </button>
                      <button 
                        className="dropdown-item w-full text-left px-4 py-2 text-sm text-gray-700"
                        onClick={handleOpenFeedback}
                      >
                        Send Feedback
                      </button>
                      <button 
                        className="dropdown-item w-full text-left px-4 py-2 text-sm text-red-600"
                        onClick={handleLogout}
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-100 p-4">
            <div className="flex flex-col space-y-3">
              <button 
                onClick={handleOpenFeedback}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium bg-transparent text-left"
              >
                Send Feedback
              </button>
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                onClick={() => setShowMobileMenu(false)}
              >
                About Us
              </Link>
              {user && (
                <>
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Prep Now
                  </Link>
                  <Link 
                    to="/profile" 
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <Link 
                    to="/saved-plans" 
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-base font-medium"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Saved Plans
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
      
      <FeedbackModal 
        isOpen={showFeedbackModal} 
        onClose={() => setShowFeedbackModal(false)} 
      />
    </>
  );
};

export default Navbar; 