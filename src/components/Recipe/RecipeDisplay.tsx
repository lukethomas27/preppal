import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';

interface RecipeDisplayProps {
  recipe: {
    title: string;
    description: string;
    ingredients: string[];
    instructions: string[];
    cooking_time: number;
    difficulty: string;
    servings: number;
    source?: string;
    modifications?: string[];
    nutritional_info?: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
  };
  onRecipeModified?: (modifiedRecipe: any) => void;
}

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onRecipeModified }) => {
  const [modificationRequest, setModificationRequest] = useState('');
  const [isModifying, setIsModifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleModifyRecipe = async () => {
    if (!modificationRequest.trim()) return;

    setIsModifying(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('modify-recipe', {
        body: { recipe, modificationRequest: modificationRequest.trim() }
      });

      if (error) throw error;

      if (data.recipe && onRecipeModified) {
        onRecipeModified(data.recipe);
        setModificationRequest('');
      }
    } catch (err) {
      setError('Failed to modify recipe. Please try again.');
      console.error('Error modifying recipe:', err);
    } finally {
      setIsModifying(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{recipe.title}</h2>
        <p className="text-gray-600">{recipe.description}</p>
      </div>

      {recipe.source && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">Recipe Source</h3>
          <p className="text-gray-700 break-words">
            { (recipe.source.toLowerCase().startsWith('http://') || recipe.source.toLowerCase().startsWith('https://')) ? (
              <a href={recipe.source} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                {recipe.source}
              </a>
            ) : recipe.source.toLowerCase().startsWith('www.') ? (
              <a href={`//${recipe.source}`} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                 {recipe.source}
               </a>
            ) : (
              recipe.source
            )}
          </p>
        </div>
      )}

      {recipe.modifications && recipe.modifications.length > 0 && (
        <div className="mb-6 p-4 bg-primary-50 rounded-lg">
          <h3 className="text-lg font-semibold text-primary-700 mb-2">Modifications</h3>
          <ul className="list-disc list-inside text-gray-700">
            {recipe.modifications.map((mod, index) => (
              <li key={index}>{mod}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block w-2 h-2 bg-primary-600 rounded-full mt-2 mr-2"></span>
                <span className="text-gray-700">{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-primary-600 text-white rounded-full mr-3 flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-gray-700">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Cooking Time</h4>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.cooking_time} minutes</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Difficulty</h4>
          <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{recipe.difficulty}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Servings</h4>
          <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.servings}</p>
        </div>
      </div>

      {recipe.nutritional_info && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutritional Information</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Calories</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.nutritional_info.calories}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Protein</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.nutritional_info.protein}g</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Carbs</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.nutritional_info.carbs}g</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-500">Fat</h4>
              <p className="mt-1 text-lg font-semibold text-gray-900">{recipe.nutritional_info.fat}g</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Want to change something?</h3>
        <div className="flex flex-col space-y-4">
          <textarea
            value={modificationRequest}
            onChange={(e) => setModificationRequest(e.target.value)}
            placeholder="Type your modification request here (e.g., 'Make it vegetarian', 'Reduce cooking time', 'Add more protein')"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={handleModifyRecipe}
            disabled={isModifying || !modificationRequest.trim()}
            className={`px-6 py-3 rounded-lg font-medium text-white ${
              isModifying || !modificationRequest.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            }`}
          >
            {isModifying ? 'Modifying...' : 'Modify Recipe'}
          </button>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
        </div>
      </div>

      {recipe.modifications && recipe.modifications.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Modifications Made</h3>
          <ul className="list-disc list-inside space-y-2">
            {recipe.modifications.map((mod, index) => (
              <li key={index} className="text-gray-700">{mod}</li>
            ))}
          </ul>
        </div>
      )}
    </motion.div>
  );
};

export default RecipeDisplay; 