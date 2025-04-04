import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import SignupForm from './components/Auth/SignupForm';
import MealPlanningForm from './components/MealPlanningForm';
import SavedMealPlans from './components/SavedMealPlans';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return user ? <>{children}</> : <Navigate to="/login" />;
};

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <img 
              src="/preppal-logo.png" 
              alt="PrepPal Logo" 
              className="h-20 w-auto" 
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">PrepPal</h1>
          <p className="mt-2 text-lg text-gray-600">Your AI-Powered Meal Prep Assistant</p>
        </div>
        <div className="flex justify-center w-full">
          {children}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      <Navbar />
      <main className="w-full flex-grow">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginForm />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <SignupForm />
              </AuthLayout>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <AppLayout>
                  <MealPlanningForm />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/saved-plans"
            element={
              <PrivateRoute>
                <AppLayout>
                  <SavedMealPlans />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout>
                  <ProfilePage />
                </AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <AppLayout>
                <AboutPage />
              </AppLayout>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;