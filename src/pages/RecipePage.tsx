import React, { useState } from 'react';
import RecipeGenerator from '../components/Recipe/RecipeGenerator';

interface Recipe {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: string;
  difficulty: string;
  tags: string[];
}

const RecipePage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipe(newRecipe);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Recipe Generator</h1>
        
        {!recipe ? (
          <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{recipe.title}</h2>
            <p className="text-gray-600 mb-6">{recipe.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                <ul className="list-disc list-inside space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="text-gray-700">{ingredient}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                <ol className="list-decimal list-inside space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="text-gray-700">{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prep Time</p>
                  <p className="font-medium">{recipe.prepTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cook Time</p>
                  <p className="font-medium">{recipe.cookTime}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Servings</p>
                  <p className="font-medium">{recipe.servings}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Difficulty</p>
                  <p className="font-medium">{recipe.difficulty}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => setRecipe(null)}
                className="btn btn-secondary"
              >
                Generate Another Recipe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipePage; 