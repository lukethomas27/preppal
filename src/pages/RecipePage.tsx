import React, { useState } from 'react';
import RecipeGenerator from '../components/Recipe/RecipeGenerator';
import Navbar from '../components/Navbar';

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

const RecipePage: React.FC = () => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  const handleRecipeGenerated = (newRecipe: Recipe) => {
    setRecipe(newRecipe);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">Recipe Generator</h1>
          
          {!recipe ? (
            <RecipeGenerator onRecipeGenerated={handleRecipeGenerated} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  {recipe.prepTime && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Prep: {recipe.prepTime}
                    </div>
                  )}
                  {recipe.cookTime && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Cook: {recipe.cookTime}
                    </div>
                  )}
                  {recipe.servings && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Servings: {recipe.servings}
                    </div>
                  )}
                  {recipe.difficulty && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      Difficulty: {recipe.difficulty}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-flex items-center justify-center w-6 h-6 bg-primary text-white rounded-full mr-3 flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {recipe.notes && recipe.notes.length > 0 && (
                <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Notes & Tips</h3>
                  <ul className="space-y-2">
                    {recipe.notes.map((note, index) => (
                      <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                        <span className="text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mt-8 flex justify-center">
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
    </>
  );
};

export default RecipePage; 