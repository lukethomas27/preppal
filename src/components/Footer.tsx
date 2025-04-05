import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-100 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/preppal-logo.png" 
                alt="PrepPal Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-primary">PrepPal</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your AI-Powered Meal Prep Assistant. Making healthy eating simple and enjoyable.
            </p>
          </div>
          <div className="flex justify-end">
            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/saved-plans" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Saved Plans
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    About Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Recipes
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                    Meal Planning Tips
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} PrepPal. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-600 hover:text-primary transition-colors duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 