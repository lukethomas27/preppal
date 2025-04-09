import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import RecipeGenerator from './components/Recipe/RecipeGenerator';
import RecipeDisplay from './components/Recipe/RecipeDisplay';
import MealPlanner from './components/MealPlanner/MealPlanner';
import Profile from './components/Profile/Profile';
import SavedRecipes from './components/Recipe/SavedRecipes';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import VerifyEmail from './components/Auth/VerifyEmail';
import Dashboard from './components/Dashboard';
import About from './components/About';
import './App.css';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const [generatedRecipe, setGeneratedRecipe] = useState<any>(null);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><LandingPage /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/login" element={<ProtectedRoute requireAuth={false} isAuthPage><Layout><Login /></Layout></ProtectedRoute>} />
          <Route path="/signup" element={<ProtectedRoute requireAuth={false} isAuthPage><Layout><Signup /></Layout></ProtectedRoute>} />
          <Route path="/forgot-password" element={<ProtectedRoute requireAuth={false} isAuthPage><Layout><ForgotPassword /></Layout></ProtectedRoute>} />
          <Route path="/reset-password" element={<ProtectedRoute requireAuth={false} isAuthPage><Layout><ResetPassword /></Layout></ProtectedRoute>} />
          <Route path="/verify-email" element={<ProtectedRoute requireAuth={false} isAuthPage><Layout><VerifyEmail /></Layout></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
          <Route 
            path="/recipe-generator" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Layout>
                  <RecipeGenerator onRecipeGenerated={setGeneratedRecipe} />
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/recipe" 
            element={
              <ProtectedRoute requireAuth={false}>
                <Layout>
                  {generatedRecipe ? <RecipeDisplay recipe={generatedRecipe} /> : <Navigate to="/recipe-generator" />}
                </Layout>
              </ProtectedRoute>
            } 
          />
          <Route path="/meal-planner" element={<ProtectedRoute><Layout><MealPlanner /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
          <Route path="/saved-recipes" element={<ProtectedRoute><Layout><SavedRecipes /></Layout></ProtectedRoute>} />

          {/* 404 Route */}
          <Route path="*" element={<Layout><div className="min-h-screen flex items-center justify-center">Page not found</div></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
