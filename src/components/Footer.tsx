import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white border-t border-gray-200 mt-auto text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/preppal-logo.png" alt="PrepPal Logo" className="h-8 w-auto" />
              <span className="text-xl font-bold text-green-600">PrepPal</span>
            </div>
            <p className="text-gray-600">
              Your AI-Powered Meal Prep Assistant. Making healthy eating simple and enjoyable.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-green-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/saved-plans" className="text-gray-600 hover:text-green-600 transition">
                  Saved Plans
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-600 hover:text-green-600 transition">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-green-600 transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-green-600 transition">
                  Recipes
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-green-600 transition">
                  Meal Planning Tips
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center text-gray-500 text-xs gap-4">
          <p>© {new Date().getFullYear()} PrepPal. All rights reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-green-600 transition">
              Terms
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Privacy
            </a>
            <a href="#" className="hover:text-green-600 transition">
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
