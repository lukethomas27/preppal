import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RecipeGenerator from './Recipe/RecipeGenerator';
import Layout from './Layout';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  notes: string[];
}

const MainPage: React.FC = () => {
  const { user } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipe(newRecipe);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Generate Your Perfect Recipe</h1>
            <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MainPage; 